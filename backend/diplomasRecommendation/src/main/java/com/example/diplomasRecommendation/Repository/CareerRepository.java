package com.example.diplomasRecommendation.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.diplomasRecommendation.Model.Career;

public interface CareerRepository extends Neo4jRepository<Career,String>{
    
}
