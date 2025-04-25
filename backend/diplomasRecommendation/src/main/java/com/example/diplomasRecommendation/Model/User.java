package com.example.diplomasRecommendation.Model;

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
    private List<Diplome> diplomes;

    public User() {
        this.diplomes = new ArrayList<>();
    }
}