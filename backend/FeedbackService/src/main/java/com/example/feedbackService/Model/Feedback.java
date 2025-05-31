package com.example.feedbackService.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

import lombok.Data;

import java.util.UUID;
import java.util.List;

@RelationshipProperties
@Data
public class Feedback {

    @Id
    @GeneratedValue
    private Long id;

    private boolean like;
    private List<String> notes;
    private float rating;
    private Integer matchPercentage;

    @TargetNode
    private Diplome diplome;

    // Default constructor required by Spring Data Neo4j
    public Feedback() {
    }

    public Feedback(boolean like, List<String> notes, float rating, Diplome diplome) {
        this.like = like;
        this.notes = notes;
        this.rating = rating;
        this.diplome = diplome;
    }

    public Feedback(boolean like, List<String> notes, float rating, Integer matchPercentage, Diplome diplome) {
        this.like = like;
        this.notes = notes;
        this.rating = rating;
        this.matchPercentage = matchPercentage;
        this.diplome = diplome;
    }
}
