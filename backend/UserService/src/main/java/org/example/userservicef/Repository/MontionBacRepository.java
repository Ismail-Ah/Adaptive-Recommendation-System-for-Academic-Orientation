package org.example.userservicef.Repository;

import org.example.userservicef.Model.MontionBac;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface MontionBacRepository extends Neo4jRepository<MontionBac, String> {
    MontionBac findByName(String name);
}