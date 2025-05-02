package com.ayman.adminservice.Repository;

import com.ayman.adminservice.Model.Career;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CareerRepository extends Neo4jRepository<Career, String> {
    Optional<Career> findByName(String career);
}