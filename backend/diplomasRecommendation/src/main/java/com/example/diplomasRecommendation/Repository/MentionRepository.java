package com.example.diplomasRecommendation.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.diplomasRecommendation.Model.Mention;

public interface MentionRepository extends Neo4jRepository<Mention,String>{
    
}
