package org.example.userservicef.Repository;

import org.example.userservicef.Model.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

public interface UserRepository extends Neo4jRepository<User, String> {
    User findByEmail(String email);
}