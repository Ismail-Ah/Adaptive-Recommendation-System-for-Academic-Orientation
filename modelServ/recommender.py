import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from ast import literal_eval

class DiplomaRecommender:
    def __init__(self, data_path):
        self.df = self.load_and_preprocess(data_path)
        self.vectorizer = TfidfVectorizer()

        # Create vectors from text features (excluding mention for better separation)
        self.df['text_features_without_mention'] = self.df.apply(
            lambda row: ' '.join(row['Matieres_Diplome']) + ' ' +
                        ' '.join(row['Career']) + ' ' +
                        (' '.join(row['Filiere']) if isinstance(row['Filiere'], list) else row['Filiere']) + ' ' +
                        str(row['Durée']),
            axis=1
        )
        self.diploma_vectors = self.vectorizer.fit_transform(self.df['text_features_without_mention'])

    def load_and_preprocess(self, data_path):
        df = pd.read_csv(data_path)

        # Convert stringified columns to lists
        for col in ['Matieres_Diplome', 'Career', 'Filiere', 'Employement_Opportunities', 'Ancienne_Diplome', 'Matieres_Etudiant']:
            df[col] = df[col].apply(lambda x: literal_eval(x) if isinstance(x, str) else x)

        return df

    def recommend(self, user_features, top_n=5):
        # Ensure filiere is a list
        user_filiere = [user_features['Filiere']] if not isinstance(user_features['Filiere'], list) else user_features['Filiere']

        # Prepare user text features for similarity
        user_text = ' '.join(user_features['Matieres_Etudiant']) + ' ' + \
                    ' '.join(user_features['Career']) + ' ' + \
                    ' '.join(user_filiere) + ' ' + \
                    str(user_features['Durée'])

        # Vectorize user input
        user_vector = self.vectorizer.transform([user_text])

        # Compute content similarity
        content_similarities = cosine_similarity(user_vector, self.diploma_vectors).flatten()

        # Mention match similarity
        user_mention = user_features.get('Mention_Bac', 'Passable')
        mention_match = np.array([
            1.0 if mention == user_mention else 0.0
            for mention in self.df['Mention_Bac']
        ])

        # Combined similarity score
        combined_scores = (0.7 * content_similarities) + (0.3 * mention_match)

        # Filter by duration if specified
        mask = pd.Series(True, index=self.df.index)
        if 'Durée' in user_features and user_features['Durée'] is not None:
            mask = (self.df['Durée'] == user_features['Durée'])

        # Get top matching diplomas
        filtered_scores = combined_scores[mask]
        top_indices = filtered_scores.argsort()[-top_n:][::-1]
        recommendations = self.df[mask].iloc[top_indices].copy()

        # Add matching percentage
        recommendations['match_score'] = filtered_scores[top_indices]
        recommendations['match_percentage'] = (filtered_scores[top_indices] * 100).round(2)

        return recommendations[[  # 'Matieres_Etudiant' is directly returned from DataFrame
            'Nom_Diplôme', 'Ecole', 'Employement_Opportunities', 'Ville', 'Matieres_Etudiant',
            'Ancienne_Diplome', 'Durée', 'Matieres_Diplome',
            'Career', 'Filiere', 'Mention_Bac', 'match_percentage'
        ]]
