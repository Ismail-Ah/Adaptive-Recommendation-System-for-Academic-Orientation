package com.example.diplomasRecommendation.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.diplomasRecommendation.Model.EmploymentOpportunity;

public interface EmploymentRepository extends Neo4jRepository<EmploymentOpportunity,String>{
    
}
