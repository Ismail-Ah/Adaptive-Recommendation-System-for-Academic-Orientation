package org.example.userservicef.Repository;

import org.example.userservicef.Model.Duree;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface DureeRepository extends Neo4jRepository<Duree, Integer> {
    Duree findByName(int duree);
}