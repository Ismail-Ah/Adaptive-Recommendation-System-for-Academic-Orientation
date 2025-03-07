package org.example.userservicef.repository;

import org.example.userservicef.model.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

public interface UserRepository extends Neo4jRepository<User, String> {
    User findByEmail(String email); // Basic find by email

    @Query("MATCH (u:User {email: $email}) " +
            "OPTIONAL MATCH (u)-[:INTERESTED_IN]->(i:Interest) " +
            "OPTIONAL MATCH (u)-[:STUDIES]->(s:Subject) " +
            "OPTIONAL MATCH (u)-[:ASPIRES_TO]->(ca:CareerAspiration) " +
            "RETURN u, collect(i) AS interests, collect(s) AS subjects, collect(ca) AS careerAspirations")
    User findUserWithRelationships(String email);
}