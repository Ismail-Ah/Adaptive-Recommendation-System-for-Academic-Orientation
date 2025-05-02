package com.ayman.adminservice.Repository;

import com.ayman.adminservice.Model.PreviousDiploma;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PreviousDiplomaRepository extends Neo4jRepository<PreviousDiploma, String> {
    Optional<PreviousDiploma> findByName(String ancienneDiplome);
}