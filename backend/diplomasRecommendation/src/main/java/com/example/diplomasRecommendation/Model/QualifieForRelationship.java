package com.example.diplomasRecommendation.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@Data
@RelationshipProperties
public class QualifieForRelationship {
    @RelationshipId
    private Long id;

    private Double matchPercentage;

    @TargetNode
    private Diplome diplome;

    public QualifieForRelationship(Diplome diplome, Double matchPercentage) {
        this.diplome = diplome;
        this.matchPercentage = matchPercentage;
    }
}