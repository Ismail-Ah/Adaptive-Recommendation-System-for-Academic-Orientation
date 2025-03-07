package org.example.userservicef.repository;

import org.example.userservicef.model.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

public interface UserRepository extends Neo4jRepository<User, String> {
    @Query("MATCH (u:User) WHERE u.email = $email RETURN u{.id, .email, .name, .password, .year, .interests, .subjects, __elementId__: elementId(u)}")
    User findByEmail(String email);
}