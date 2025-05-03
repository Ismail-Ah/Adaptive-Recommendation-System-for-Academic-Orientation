import pandas as pd
import numpy as np
import ast
import torch
import networkx as nx
from sklearn.preprocessing import StandardScaler, MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
from torch_geometric.utils import from_networkx
from torch_geometric.nn import GCNConv
import logging
import os
import hashlib
from scipy import sparse
from .fetch import export_to_csv

logger = logging.getLogger(__name__)

class DiplomaRecommender:
    """A recommender system for diplomas using Graph Convolutional Networks (GCN)."""
    
    def __init__(self, data_path, model_path):
        """
        Initialize the DiplomaRecommender.
        
        Args:
            data_path (str): Path to the CSV data file.
            model_path (str): Path to save/load the trained model.
        """
        self.data_path = data_path
        self.model_path = model_path
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.data_hash = None
        self.load_data_and_train()

    def _compute_data_hash(self, df):
        """Compute a hash of the DataFrame to detect changes."""
        df_str = df.to_string()
        return hashlib.sha256(df_str.encode()).hexdigest()

    def _safe_literal_eval(self, value):
        """Safely parse string representations of lists."""
        if pd.isna(value):
            return []
        if isinstance(value, list):
            return value
        try:
            value = str(value).strip()
            if value.startswith('[') and value.endswith(']'):
                return ast.literal_eval(value.replace("'", '"'))
            elif ',' in value:
                return [item.strip().strip("'\"") for item in value.split(',')]
            return [value.strip("'\"")] if value else []
        except (ValueError, SyntaxError, AttributeError) as e:
            logger.warning(f"Error parsing value {value}: {e}")
            return []

    def _encode_features(self, df):
        """Encode categorical and numerical features."""
        self.mlb_subjects = MultiLabelBinarizer(sparse_output=True)
        self.mlb_employments = MultiLabelBinarizer(sparse_output=True)
        self.mlb_filiere = MultiLabelBinarizer(sparse_output=True)

        subjects_encoded = self.mlb_subjects.fit_transform(df['Matieres_Etudiant'])
        employments_encoded = self.mlb_employments.fit_transform(df['Career'])
        filiere_encoded = self.mlb_filiere.fit_transform(df['Filiere'])

        logger.info(f"Valid subjects: {self.mlb_subjects.classes_}")
        logger.info(f"Valid careers: {self.mlb_employments.classes_}")
        logger.info(f"Valid filieres: {self.mlb_filiere.classes_}")

        self.mention_map = {'Mention Très Bien': 3, 'Bien': 2, 'Assez Bien': 1, 'Passable': 0}
        df['Mention_Bac'] = df['Mention_Bac'].map(self.mention_map).fillna(0)

        self.scaler = StandardScaler()
        durée_scaled = self.scaler.fit_transform(df[['Durée']].values)

        # Convert sparse matrices to dense for stacking
        node_features = sparse.hstack([
            subjects_encoded,
            employments_encoded,
            filiere_encoded,
            sparse.csr_matrix(durée_scaled),
            sparse.csr_matrix(df[['Mention_Bac']].values)
        ]).toarray()

        return node_features

    def _build_graph(self, df, node_features):
        """Construct a graph based on node features and similarity."""
        self.G = nx.Graph()
        self.node_names = []
        for idx, row in df.iterrows():
            self.G.add_node(
                row['Unique_Diplôme'],
                features=node_features[idx],
                index=idx
            )
            self.node_names.append(row['Unique_Diplôme'])

        similarity_matrix = cosine_similarity(node_features)
        similarity_threshold = 0.7
        for i in range(len(df)):
            for j in range(i + 1, len(df)):
                if similarity_matrix[i, j] > similarity_threshold:
                    diploma1 = df.iloc[i]['Unique_Diplôme']
                    diploma2 = df.iloc[j]['Unique_Diplôme']
                    self.G.add_edge(diploma1, diploma2, weight=similarity_matrix[i, j])

        logger.info(f"Graph created with {self.G.number_of_nodes()} nodes and {self.G.number_of_edges()} edges")
        logger.info(f"Connected components: {nx.number_connected_components(self.G)}")

    def _convert_to_pyg(self, node_features):
        """Convert NetworkX graph to PyTorch Geometric format."""
        self.data = from_networkx(self.G)
        self.data.x = torch.tensor(node_features, dtype=torch.float)
        self.data.y = torch.zeros(len(self.df), dtype=torch.long)
        self.data = self.data.to(self.device)
        logger.info(f"PyTorch Geometric data: {self.data}")

    def _define_gcn(self, in_channels):
        """Define the GCN model."""
        class DiplomaGCN(torch.nn.Module):
            def __init__(self, in_channels, hidden_channels, out_channels):
                super().__init__()
                self.conv1 = GCNConv(in_channels, hidden_channels)
                self.conv2 = GCNConv(hidden_channels, out_channels)

            def forward(self, data):
                x, edge_index = data.x, data.edge_index
                x = self.conv1(x, edge_index).relu()
                x = self.conv2(x, edge_index)
                return x

        return DiplomaGCN(in_channels, hidden_channels=64, out_channels=32).to(self.device)

    def _train_model(self):
        """Train the GCN model with contrastive loss."""
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.01)
        self.model.train()

        def contrastive_loss(embeddings, edge_index, node_names):
            pos_loss = 0
            neg_loss = 0
            num_neg = edge_index.size(1)
            for i, j in edge_index.t():
                pos_sim = torch.cosine_similarity(embeddings[i], embeddings[j], dim=0)
                pos_loss += -torch.log(torch.sigmoid(pos_sim))

            neg_i = torch.randint(0, embeddings.size(0), (num_neg,), device=self.device)
            neg_j = torch.randint(0, embeddings.size(0), (num_neg,), device=self.device)
            for idx_i, idx_j in zip(neg_i, neg_j):
                node_i = node_names[idx_i.item()]
                node_j = node_names[idx_j.item()]
                if not self.G.has_edge(node_i, node_j):
                    neg_sim = torch.cosine_similarity(embeddings[idx_i], embeddings[idx_j], dim=0)
                    neg_loss += -torch.log(1 - torch.sigmoid(neg_sim))

            return (pos_loss + neg_loss) / num_neg

        for epoch in range(10):
            optimizer.zero_grad()
            embeddings = self.model(self.data)
            loss = contrastive_loss(embeddings, self.data.edge_index, self.node_names)
            loss.backward()
            optimizer.step()
            if epoch % 10 == 0:
                logger.info(f"Epoch {epoch}, Loss: {loss.item():.4f}")

        torch.save(self.model.state_dict(), self.model_path)
        logger.info(f"Model saved to {self.model_path}")

    def load_data_and_train(self):
        logger.info("Fetching data from Neo4j")
        export_to_csv(self.data_path)

        # Load and preprocess data
        self.df = pd.read_csv(self.data_path)
        self.data_hash = self._compute_data_hash(self.df)

        required_columns = ['Nom_Diplôme', 'Ecole', 'Durée', 'Matieres_Etudiant', 'Career', 'Filiere', 'Mention_Bac']
        missing_columns = [col for col in required_columns if col not in self.df.columns]
        if missing_columns:
            logger.error(f"Missing columns in data.csv: {missing_columns}")
            raise KeyError(f"Missing columns: {missing_columns}")

        self.df['Unique_Diplôme'] = (self.df['Nom_Diplôme'] + '_' + self.df['Ecole']).str.replace(' ', '_')
        if self.df['Unique_Diplôme'].duplicated().sum() > 0:
            logger.warning(f"Found duplicate Unique_Diplôme entries.")
        else:
            logger.info(f"No duplicate Unique_Diplôme entries found.")

        # Convert list columns
        for col in ['Matieres_Etudiant', 'Career', 'Filiere', 'Employement_Opportunities', 'Matieres_Diplome', 'Ancienne_Diplome']:
            if col in self.df.columns:
                self.df[col] = self.df[col].apply(self._safe_literal_eval)

        # Encode features
        node_features = self._encode_features(self.df)

        # Store diploma info
        self.diploma_info = self.df.set_index('Unique_Diplôme')[
            ['Nom_Diplôme', 'Ecole', 'Durée', 'Matieres_Etudiant', 'Career', 'Filiere']
        ].to_dict('index')

        # Build graph and convert to PyTorch Geometric
        self._build_graph(self.df, node_features)
        self._convert_to_pyg(node_features)

        # Define and train/load model
        self.model = self._define_gcn(self.data.x.shape[1])
        if os.path.exists(self.model_path):
            logger.info(f"Loading saved model from {self.model_path}")
            self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
        else:
            logger.info("Training new model")
            self._train_model()

        self.model.eval()
        with torch.no_grad():
            self.diploma_embeddings = self.model(self.data).cpu()

        logger.info(f"Diploma embeddings shape: {self.diploma_embeddings.shape}")

    def retrain(self):
        """Retrain the model if data has changed."""
        logger.info("Checking for data changes")
        export_to_csv(self.data_path)
        temp_df = pd.read_csv(self.data_path)
        new_hash = self._compute_data_hash(temp_df)

        if new_hash == self.data_hash:
            logger.info("No data changes detected. Skipping retraining.")
            return
        else:
            logger.info("Data changes detected. Starting retraining.")
            self.load_data_and_train()
            logger.info("Model retrained and saved successfully")

    def encode_user_input(self, features):
        """Encode user input features for prediction."""
        user_filiere = [features['Filiere']] if isinstance(features['Filiere'], str) else features.get('Filiere', [])
        try:
            subjects_encoded = self.mlb_subjects.transform([features.get('Matieres_Etudiant', [])]).toarray()
            employments_encoded = self.mlb_employments.transform([features.get('Career', [])]).toarray()
            filiere_encoded = self.mlb_filiere.transform([user_filiere]).toarray()
        except ValueError as e:
            logger.warning(f"User feature encoding error: {e}. Using empty features.")
            subjects_encoded = np.zeros((1, len(self.mlb_subjects.classes_)))
            employments_encoded = np.zeros((1, len(self.mlb_employments.classes_)))
            filiere_encoded = np.zeros((1, len(self.mlb_filiere.classes_)))

        durée_scaled = self.scaler.transform(np.array([[features.get('Durée', 0)]]))
        mention_bac = self.mention_map.get(features.get('Mention_Bac', ''), 0)

        user_features = np.hstack([
            subjects_encoded,
            employments_encoded,
            filiere_encoded,
            durée_scaled,
            np.array([[mention_bac]])
        ])

        return torch.tensor(user_features, dtype=torch.float).to(self.device)

    def validate_user_input(self, features):
        """Validate user input features."""
        invalid = []
        for key in ['Matieres_Etudiant', 'Filiere', 'Career']:
            if key not in features:
                invalid.append(f"Missing key: {key}")

        for subject in features.get('Matieres_Etudiant', []):
            if subject not in self.mlb_subjects.classes_:
                invalid.append(f"Subject: {subject}")

        for career in features.get('Career', []):
            if career not in self.mlb_employments.classes_:
                invalid.append(f"Career: {career}")

        user_filiere = [features['Filiere']] if isinstance(features['Filiere'], str) else features.get('Filiere', [])
        for filiere in user_filiere:
            if filiere not in self.mlb_filiere.classes_:
                invalid.append(f"Filiere: {filiere}")

        if invalid:
            logger.warning(f"Invalid user inputs: {', '.join(invalid)}")
            return False
        return True

    def predict(self, features, desired_duree=None, top_k=5):
        """Predict top-k diploma recommendations based on user features."""
        user_filiere = [features['Filiere']] if isinstance(features['Filiere'], str) else features.get('Filiere', [])
        user_employments = set(features.get('Career', []))
        user_subjects = set(features.get('Matieres_Etudiant', []))
        employment_missing = len(user_employments) == 0
        duration_missing = desired_duree is None or desired_duree == 0

        user_features = self.encode_user_input(features)

        with torch.no_grad():
            temp_G = self.G.copy()
            temp_G.add_node('user', features=user_features.cpu().numpy(), index=-1)
            temp_data = from_networkx(temp_G)
            temp_data.x = torch.vstack([self.data.x, user_features])
            temp_data = temp_data.to(self.device)
            all_embeddings = self.model(temp_data)
            user_embedding = all_embeddings[-1].unsqueeze(0)

        similarities = torch.cosine_similarity(user_embedding, self.diploma_embeddings.to(self.device), dim=1).cpu().numpy()

        valid_predictions = []
        for idx in similarities.argsort()[::-1]:
            if len(valid_predictions) >= top_k:
                break
            unique_diploma = self.df.iloc[idx]['Unique_Diplôme']
            info = self.diploma_info.get(unique_diploma, {})
            try:
                diploma_name, school = unique_diploma.rsplit('_', 1)
            except ValueError:
                diploma_name, school = unique_diploma, "Unknown"

            filiere_match = any(f in info.get('Filiere', []) for f in user_filiere)
            duration_match = duration_missing or (desired_duree is not None and desired_duree > 0 and info.get('Durée', 0) == desired_duree)
            employment_match = employment_missing or len(user_employments & set(info.get('Career', []))) > 0

            if filiere_match and duration_match and employment_match:
                subject_overlap = len(user_subjects & set(info.get('Matieres_Etudiant', []))) / max(1, len(user_subjects))
                employment_overlap = len(user_employments & set(info.get('Career', []))) / max(1, len(user_employments))
                field_overlap = sum(1 for f in user_filiere if f in info.get('Filiere', [])) / max(1, len(user_filiere))

                final_score = (
                    similarities[idx] * 0.5 +
                    subject_overlap * 0.2 +
                    employment_overlap * 0.2 +
                    field_overlap * 0.1
                )

                row = {
                    'Nom_Diplôme': diploma_name,
                    'Ecole': school,
                    'Employement_Opportunities': self.df.iloc[idx].get('Employement_Opportunities', []),
                    'Ville': self.df.iloc[idx].get('Ville', 'Unknown'),
                    'Matieres_Etudiant': info.get('Matieres_Etudiant', []),
                    'Ancienne_Diplome': self.df.iloc[idx].get('Ancienne_Diplome', []),
                    'Durée': info.get('Durée', 0),
                    'Matieres_Diplome': self.df.iloc[idx].get('Matieres_Diplome', []),
                    'Career': info.get('Career', []),
                    'Filiere': info.get('Filiere', []),
                    'Mention_Bac': self.df.iloc[idx].get('Mention_Bac', 'Passable'),
                    'match_percentage': final_score * 100
                }
                valid_predictions.append(row)

        if not valid_predictions:
            logger.warning("No matching diplomas found")
            return pd.DataFrame(columns=[
                'Nom_Diplôme', 'Ecole', 'Employement_Opportunities', 'Ville', 'Matieres_Etudiant',
                'Ancienne_Diplome', 'Durée', 'Matieres_Diplome', 'Career', 'Filiere', 'Mention_Bac',
                'match_percentage'
            ])

        recommendations = pd.DataFrame(valid_predictions)
        recommendations = recommendations.drop_duplicates(subset=['Nom_Diplôme', 'Ecole'])
        recommendations = recommendations.head(top_k)

        return recommendations[[
            'Nom_Diplôme', 'Ecole', 'Employement_Opportunities', 'Ville', 'Matieres_Etudiant',
            'Ancienne_Diplome', 'Durée', 'Matieres_Diplome', 'Career', 'Filiere', 'Mention_Bac',
            'match_percentage'
        ]]