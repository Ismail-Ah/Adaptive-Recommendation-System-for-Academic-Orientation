package org.example.userservicef.repository;

import org.example.userservicef.model.Interest;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface InterestRepository extends Neo4jRepository<Interest, String> {
}