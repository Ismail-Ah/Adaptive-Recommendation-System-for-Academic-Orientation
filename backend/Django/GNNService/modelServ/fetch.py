import pandas as pd
import logging
import csv
from neo4j import GraphDatabase
from django.conf import settings

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

class Neo4jConnection:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(settings.NEO4J_USERNAME, settings.NEO4J_PASSWORD)
        )

    def close(self):
        self.driver.close()

    def run_query(self, query, parameters=None):
        with self.driver.session() as session:
            result = session.run(query, parameters or {})
            return [record for record in result]

def export_to_csv(output_file='data.csv'):
    try:
        query = """
        MATCH (d:Diplome)
        OPTIONAL MATCH (d)-[:OFFERED_BY]->(e:Ecole)
        OPTIONAL MATCH (e)-[:LOCATED_IN]->(v:Ville)
        OPTIONAL MATCH (d)-[:REQUIRES_MENTION]->(m:MentionBac)
        OPTIONAL MATCH (d)-[:LEADS_TO_CAREER]->(c:Career)
        OPTIONAL MATCH (d)-[:OFFERS_OPPORTUNITY]->(o:EmploymentOpportunity)
        OPTIONAL MATCH (d)-[:REQUIRES_PREVIOUS]->(p:AncienneDiplome)
        OPTIONAL MATCH (d)-[:BELONGS_TO_FILIERE]->(f:Filiere)
        OPTIONAL MATCH (d)-[:INCLUDES_SUBJECT]->(s:MatiereDiplome)
        OPTIONAL MATCH (d)-[:REQUIRES_STUDENT_SUBJECT]->(ss:MatiereEtudiant)
        OPTIONAL MATCH (d)-[:HAS_DURATION]->(dd:Duree)
        
        WITH 
            d.name AS diplomaName,
            e.name AS schoolName,
            collect(DISTINCT c.name) AS career,
            collect(DISTINCT o.name) AS employmentOpportunities,
            collect(DISTINCT p.name) AS ancienneDiplome,
            collect(DISTINCT f.name) AS filiere,
            head(collect(dd.years)) AS duree,
            head(collect(m.name)) AS mentionBac,
            head(collect(v.name)) AS villeRaw,
            collect(DISTINCT s.name) AS matieresDiplome,
            collect(DISTINCT ss.name) AS matieresEtudiant
        WHERE diplomaName IS NOT NULL
        
        RETURN
            coalesce(diplomaName, 'N/A') AS nomDiplome,
            coalesce(schoolName, '') AS ecole,
            [x IN career WHERE x IS NOT NULL] AS career,
            [x IN employmentOpportunities WHERE x IS NOT NULL] AS employmentOpportunities,
            [x IN ancienneDiplome WHERE x IS NOT NULL] AS ancienneDiplome,
            [x IN filiere WHERE x IS NOT NULL] AS filiere,
            duree,
            coalesce(mentionBac, '') AS mentionBac,
            coalesce(villeRaw, '') AS ville,
            [x IN matieresDiplome WHERE x IS NOT NULL] AS matieresDiplome,
            [x IN matieresEtudiant WHERE x IS NOT NULL] AS matieresEtudiant
        ORDER BY nomDiplome, ecole
        """

        logger.info("Executing Neo4j query")
        neo4j_conn = Neo4jConnection()
        results = neo4j_conn.run_query(query)
        logger.info(f"Retrieved {len(results)} records from Neo4j")
        neo4j_conn.close()

        if not results:
            logger.warning("No data returned from Neo4j")
            raise ValueError("No data found")

        data = []
        for record in results:
            def format_list(lst):
                if not lst or lst == ['']:
                    return '[]'
                cleaned_items = [str(item).replace("'", "").replace('"', '').strip() for item in lst if item]
                return "['" + "', '".join(cleaned_items) + "']" if cleaned_items else '[]'

            row = {
                'Nom_Diplôme': record['nomDiplome'] or '',
                'Ecole': record['ecole'],
                'Career': format_list(record['career']),
                'Employement_Opportunities': format_list(record['employmentOpportunities']),
                'Ancienne_Diplome': format_list(record['ancienneDiplome']),
                'Filiere': format_list(record['filiere']),
                'Durée': str(record['duree']) if record['duree'] is not None else '',
                'Mention_Bac': record['mentionBac'],
                'Ville': record['ville'],
                'Matieres_Diplome': format_list(record['matieresDiplome']),
                'Matieres_Etudiant': format_list(record['matieresEtudiant'])
            }
            data.append(row)
            if len(data) <= 5:
                logger.debug(f"Sample record: {row}")

        df = pd.DataFrame(data)
        logger.info(f"Created DataFrame with {len(df)} rows")

        df.to_csv(output_file, index=False, quoting=csv.QUOTE_NONNUMERIC, encoding='utf-8')
        logger.info(f"CSV exported successfully to {output_file}")
        return df

    except Exception as e:
        logger.error(f"Error exporting CSV: {str(e)}", exc_info=True)
        raise