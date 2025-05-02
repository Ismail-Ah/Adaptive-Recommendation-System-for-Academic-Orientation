package com.ayman.adminservice.Repository;

import com.ayman.adminservice.Model.School;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchoolRepository extends Neo4jRepository<School, Long> {
    Optional<School> findByName(String name);
}