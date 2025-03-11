package org.example.userservicef.Repository;

import org.example.userservicef.Model.Student;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface StudentRepository extends Neo4jRepository<Student, String> {
}
