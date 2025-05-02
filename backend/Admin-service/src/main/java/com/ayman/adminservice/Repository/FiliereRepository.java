package com.ayman.adminservice.Repository;

import com.ayman.adminservice.Model.Filiere;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FiliereRepository extends Neo4jRepository<Filiere, Long> {
    Optional<Filiere> findByName(String name);
}