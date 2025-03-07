package org.example.userservicef.repository;

import org.example.userservicef.model.CareerAspiration;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface CareerAspirationRepository extends Neo4jRepository<CareerAspiration, String> {
}