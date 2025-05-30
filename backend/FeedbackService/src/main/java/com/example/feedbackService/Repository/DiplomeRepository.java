package com.example.feedbackService.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import com.example.feedbackService.Model.Diplome;

public interface DiplomeRepository extends Neo4jRepository<Diplome,String>{
    Diplome findByName(String name);
    
}
