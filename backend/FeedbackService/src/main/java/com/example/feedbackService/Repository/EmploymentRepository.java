package com.example.feedbackService.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.feedbackService.Model.EmploymentOpportunity;

public interface EmploymentRepository extends Neo4jRepository<EmploymentOpportunity,String>{
    
}
