FROM neo4j:5.20

ENV NEO4J_AUTH=neo4j/pfa_userservice

EXPOSE 7474 7687


##to build image run : docker build -t neo4j-user-service .
##then to run container from image run : docker run -d --name neo4j-user-service -p 7474:7474 -p 7687:7687 -v neo4j_user_data:/data neo4j-user-service
