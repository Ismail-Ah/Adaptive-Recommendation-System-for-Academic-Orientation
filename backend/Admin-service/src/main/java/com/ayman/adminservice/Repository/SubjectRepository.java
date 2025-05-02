package com.ayman.adminservice.Repository;

import com.ayman.adminservice.Model.Subject;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubjectRepository extends Neo4jRepository<Subject, Long> {
    Optional<Subject> findByName(String name);
}