package com.example.diplomasRecommendation.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import com.example.diplomasRecommendation.Model.Diplome;

public interface DiplomeRepository extends Neo4jRepository<Diplome,String>{
    Diplome findByName(String name);
    
}
