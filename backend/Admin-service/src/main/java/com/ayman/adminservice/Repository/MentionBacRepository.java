package com.ayman.adminservice.Repository;

import com.ayman.adminservice.Model.MentionBac;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentionBacRepository extends Neo4jRepository<MentionBac, String> {
    Optional<MentionBac> findByName(String mention);
}