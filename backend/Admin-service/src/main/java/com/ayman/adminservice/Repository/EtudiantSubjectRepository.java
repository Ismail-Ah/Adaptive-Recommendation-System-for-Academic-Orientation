package com.ayman.adminservice.Repository;

import com.ayman.adminservice.Model.EtudiantSubject;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EtudiantSubjectRepository extends Neo4jRepository<EtudiantSubject, Long> {
    Optional<EtudiantSubject> findByName(String name);
}