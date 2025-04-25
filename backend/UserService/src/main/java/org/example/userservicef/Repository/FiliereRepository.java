package org.example.userservicef.Repository;

import org.example.userservicef.Model.Filiere;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface FiliereRepository extends Neo4jRepository<Filiere, String> {
    Filiere findByName(String name);
}