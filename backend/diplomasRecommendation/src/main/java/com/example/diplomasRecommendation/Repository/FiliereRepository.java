package com.example.diplomasRecommendation.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.diplomasRecommendation.Model.Filiere;

public interface FiliereRepository extends Neo4jRepository<Filiere,String>{
    
}
