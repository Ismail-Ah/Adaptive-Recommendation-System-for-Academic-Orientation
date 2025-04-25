package org.example.userservicef.Repository;

import org.example.userservicef.Model.Year;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface YearRepository extends Neo4jRepository<Year, String> {
    Year findByName(String name);
}