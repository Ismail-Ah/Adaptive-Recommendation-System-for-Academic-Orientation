package com.example.feedbackService.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.feedbackService.Model.MatiereEtudiant;

public interface MatiereEtudRepo extends Neo4jRepository<MatiereEtudiant,String>{
    
}
