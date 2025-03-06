package org.example.userservicef.repository;

import org.example.userservicef.model.Student;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface StudentRepository extends Neo4jRepository<Student, String> {
}
