package org.example.userservicef.Repository;

import org.example.userservicef.Model.Subject;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface SubjectRepository extends Neo4jRepository<Subject, String> {
}