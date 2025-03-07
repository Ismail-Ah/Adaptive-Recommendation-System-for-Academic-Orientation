package org.example.userservicef.repository;

import org.example.userservicef.model.Subject;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface SubjectRepository extends Neo4jRepository<Subject, String> {
}