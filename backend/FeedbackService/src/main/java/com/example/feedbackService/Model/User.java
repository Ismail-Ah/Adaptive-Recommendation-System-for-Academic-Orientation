package com.example.feedbackService.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.ArrayList;
import java.util.List;

@Data
@Node("User")
public class User {
    @Id
    private String email;

    @Relationship(type = "QUALIFIE_FOR")
    private List<QualifieForRelationship> diplomeRelationships;
    
    @Relationship(type = "HAS_FEEDBACK")
    private List<Feedback> feedbacks = new ArrayList<>();

    public User() {
        this.diplomeRelationships = new ArrayList<>();
    }

    // Helper method to get diplomas (optional, for convenience)
    public List<Diplome> getDiplomes() {
        List<Diplome> diplomes = new ArrayList<>();
        for (QualifieForRelationship relationship : diplomeRelationships) {
            diplomes.add(relationship.getDiplome());
        }
        return diplomes;
    }

    // Helper method to set diplomas (optional, for compatibility)
    public void setDiplomes(List<Diplome> diplomes) {
        this.diplomeRelationships = new ArrayList<>();
        for (Diplome diplome : diplomes) {
            this.diplomeRelationships.add(new QualifieForRelationship(diplome, 0.0)); // Default match_percentage
        }
    }
}