package com.ayman.adminservice.Repository;

import com.ayman.adminservice.Model.Duration;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DurationRepository extends Neo4jRepository<Duration, Long> {
    Optional<Duration> findByYears(Integer years);
}