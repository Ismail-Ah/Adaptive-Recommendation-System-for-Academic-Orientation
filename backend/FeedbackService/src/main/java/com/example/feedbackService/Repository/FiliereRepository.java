package com.example.feedbackService.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.feedbackService.Model.Filiere;

public interface FiliereRepository extends Neo4jRepository<Filiere,String>{
    
}
