package com.example.feedbackService.Repository;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.feedbackService.Model.User;

@Repository
public interface UserRepository extends Neo4jRepository<User, String> {   
    Optional<User> findByEmail(String email);

    @Query("MATCH (u:User {email: $email})-[r:HAS_FEEDBACK]->(d:Diplome {name: $diplomeName}) DELETE r")
    void deleteFeedbackRelationship(@Param("email") String email, @Param("diplomeName") String diplomeName);
}