package com.example.diplomasRecommendation.Repository;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import com.example.diplomasRecommendation.Model.User;

@Repository
public interface UserRepository extends Neo4jRepository<User, String> {   
    Optional<User> findByEmail(String email);
}