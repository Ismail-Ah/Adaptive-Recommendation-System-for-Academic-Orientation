package com.example.diplomasRecommendation.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.diplomasRecommendation.Model.MatiereDiplome;

public interface MatiereDiplomeRepo extends Neo4jRepository<MatiereDiplome,String>{
    
}
