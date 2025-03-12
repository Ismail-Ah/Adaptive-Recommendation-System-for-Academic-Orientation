package org.example.userservicef.Repository;

import org.example.userservicef.Model.CareerAspiration;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerAspirationRepository extends Neo4jRepository<CareerAspiration, String> {
}