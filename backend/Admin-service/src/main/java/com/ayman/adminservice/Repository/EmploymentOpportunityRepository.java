package com.ayman.adminservice.Repository;

import com.ayman.adminservice.Model.EmploymentOpportunity;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmploymentOpportunityRepository extends Neo4jRepository<EmploymentOpportunity, String> {
    Optional<EmploymentOpportunity> findByName(String oppotunity);
}