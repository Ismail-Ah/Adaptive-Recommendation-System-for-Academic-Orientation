package org.example.userservicef.Repository;

import org.example.userservicef.Model.Interest;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface InterestRepository extends Neo4jRepository<Interest, String> {
}