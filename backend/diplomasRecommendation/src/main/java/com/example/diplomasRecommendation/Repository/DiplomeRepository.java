package com.example.diplomasRecommendation.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import com.example.diplomasRecommendation.Model.Diplome;

@Repository
public interface DiplomeRepository extends Neo4jRepository<Diplome, String> {
    Diplome findByName(String name);

    @Query("MATCH (d:Diplome {id: $diplomeId})<-[:HAS_FEEDBACK]-(:User) RETURN count(*)")
    int countFeedbackRelationships(String diplomeId);
}
