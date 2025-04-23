import pandas as pd
import logging
import csv
from neo4j import GraphDatabase

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('export.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Neo4j connection configuration
NEO4J_URI = "bolt://localhost:7687"  # Update with your Neo4j URI
NEO4J_USERNAME = "neo4j"
NEO4J_PASSWORD = "your_password"  # Update with your Neo4j password

class Neo4jConnection:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            NEO4J_URI,
            auth=(NEO4J_USERNAME, NEO4J_PASSWORD)
        )

    def close(self):
        self.driver.close()

    def run_query(self, query, parameters=None):
        with self.driver.session() as session:
            result = session.run(query, parameters or {})
            return [record for record in result]

def export_to_csv():
    try:
        query = """
        MATCH (d:Diplome)
        OPTIONAL MATCH (d)-[:OFFERED_BY]->(e:Ecole)
        OPTIONAL MATCH (d)-[:LOCATED_IN]->(v:Ville)
        OPTIONAL MATCH (d)-[:REQUIRES_MENTION]->(m:MentionBac)
        OPTIONAL MATCH (d)-[:RELATED_TO]->(c:Career)
        OPTIONAL MATCH (d)-[:LEADS_TO]->(j:Job)
        OPTIONAL MATCH (d)-[:REQUIRES]->(p:PrerequisiteDiploma)
        OPTIONAL MATCH (d)-[:ASSOCIATED_WITH]->(f:Filiere)
        OPTIONAL MATCH (d)-[:TEACHES]->(s:Subject)
        OPTIONAL MATCH (d)-[:STUDENT_SUBJECT]->(ss:Subject)
        WITH 
            d.nom_diplome AS Nom_Diplôme,
            d.duree AS Durée,
            d.unique_id AS unique_id,
            coalesce(e.name, '') AS Ecole,
            coalesce(m.name, '') AS Mention_Bac,
            coalesce(v.name, '') AS Ville,
            collect(distinct coalesce(c.name, '')) AS Career,
            collect(distinct coalesce(j.name, '')) AS Employement_Opportunities,
            collect(distinct coalesce(p.name, '')) AS Ancienne_Diplome,
            collect(distinct coalesce(f.name, '')) AS Filiere,
            collect(distinct coalesce(s.name, '')) AS Matieres_Diplome,
            collect(distinct coalesce(ss.name, '')) AS Matieres_Etudiant
        RETURN 
            Nom_Diplôme,
            Ecole,
            Career,
            Employement_Opportunities,
            Ancienne_Diplome,
            Filiere,
            Durée,
            Mention_Bac,
            Ville,
            Matieres_Diplome,
            Matieres_Etudiant
        ORDER BY Nom_Diplôme, unique_id
        """

        logger.info("Executing Neo4j query")
        neo4j_conn = Neo4jConnection()
        results = neo4j_conn.run_query(query)
        logger.info(f"Retrieved {len(results)} records from Neo4j")
        neo4j_conn.close()

        if not results:
            logger.warning("No data returned from Neo4j")
            print("No data found")
            return

        data = []
        for record in results:
            # Format lists to match original CSV (e.g., "['a', 'b']")
            def format_list(lst):
                if not lst or lst == ['']:
                    return '[]'
                # Clean and quote each item
                cleaned_items = [str(item).replace("'", "").replace('"', '').strip() for item in lst if item]
                return "['" + "', '".join(cleaned_items) + "']" if cleaned_items else '[]'

            row = {
                'Nom_Diplôme': record['Nom_Diplôme'] or '',
                'Ecole': record['Ecole'],
                'Career': format_list(record['Career']),
                'Employement_Opportunities': format_list(record['Employement_Opportunities']),
                'Ancienne_Diplome': format_list(record['Ancienne_Diplome']),
                'Filiere': format_list(record['Filiere']),
                'Durée': str(record['Durée']) if record['Durée'] is not None else '',
                'Mention_Bac': record['Mention_Bac'],
                'Ville': record['Ville'],
                'Matieres_Diplome': format_list(record['Matieres_Diplome']),
                'Matieres_Etudiant': format_list(record['Matieres_Etudiant'])
            }
            data.append(row)

            # Log sample record for debugging
            if len(data) <= 5:
                logger.debug(f"Sample record: {row}")

        # Create DataFrame
        df = pd.DataFrame(data)
        logger.info(f"Created DataFrame with {len(df)} rows")

        # Save to CSV
        output_file = "exported_data.csv"
        df.to_csv(output_file, index=False, quoting=csv.QUOTE_NONNUMERIC, encoding='utf-8')
        logger.info(f"CSV exported successfully to {output_file}")
        print(f"CSV exported successfully to {output_file}")

        # Compare with original CSV
        try:
            original = pd.read_csv('data.csv')  # Update path if needed
            original_row_count = len(original)
            if len(df) != original_row_count:
                logger.warning(f"Row count mismatch: Exported {len(df)} rows, expected {original_row_count}")
            else:
                logger.info("Row count matches original CSV")
            # Sample comparison
            for idx, row in df.head(5).iterrows():
                orig_row = original[original['Nom_Diplôme'] == row['Nom_Diplôme']]
                if not orig_row.empty:
                    for col in df.columns:
                        exported_val = str(row[col])
                        orig_val = str(orig_row[col].iloc[0])
                        if exported_val != orig_val:
                            logger.warning(f"Mismatch at row {idx}, column {col}: Exported={exported_val}, Original={orig_val}")
        except FileNotFoundError:
            logger.warning("Original CSV (data.csv) not found, skipping comparison")

    except Exception as e:
        logger.error(f"Error exporting CSV: {str(e)}", exc_info=True)
        print(f"Error exporting CSV: {str(e)}")


if __name__ == "__main__":
    export_to_csv()