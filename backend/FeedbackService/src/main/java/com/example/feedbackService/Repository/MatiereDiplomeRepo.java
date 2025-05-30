package com.example.feedbackService.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.feedbackService.Model.MatiereDiplome;

public interface MatiereDiplomeRepo extends Neo4jRepository<MatiereDiplome,String>{
    
}
