package com.example.diplomasRecommendation.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.diplomasRecommendation.Model.MatiereEtudiant;

public interface MatiereEtudRepo extends Neo4jRepository<MatiereEtudiant,String>{
    
}
