from neo4j import GraphDatabase
from django.conf import settings

class Neo4jConnection:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            settings.NEO4J_CONFIG['uri'],
            auth=(settings.NEO4J_CONFIG['username'], settings.NEO4J_CONFIG['password'])
        )

    def close(self):
        self.driver.close()

    def run_query(self, query, parameters=None):
        with self.driver.session() as session:
            result = session.run(query, parameters or {})
            return [record for record in result]

def get_neo4j_connection():
    return Neo4jConnection()