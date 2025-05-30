package com.example.feedbackService.Repository;

import org.springframework.data.neo4j.repository.Neo4jRepository;

import com.example.feedbackService.Model.Mention;

public interface MentionRepository extends Neo4jRepository<Mention,String>{
    
}
