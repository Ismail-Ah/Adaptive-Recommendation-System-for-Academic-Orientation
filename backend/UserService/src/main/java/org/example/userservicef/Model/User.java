package org.example.userservicef.Model;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import lombok.Data;

import java.util.Set; // Use Set instead of List to avoid duplicates

@Node("User") // Consider renaming to "Student" to align with your context
@Data
public class User {
    @Id
    private String email; // Unique identifier

    private String name;
    private String password; // Consider hashing this (e.g., with BCrypt)
    private String year;
    private String role;

    // Relationships to Interest nodes
    @Relationship(type = "INTERESTED_IN", direction = Relationship.Direction.OUTGOING)
    private Set<Interest> interests;

    // Relationships to Interest nodes
    @Relationship(type = "STUDIES_FILIERE", direction = Relationship.Direction.OUTGOING)
    private Filiere filiere;

    // Relationships to Interest nodes
    @Relationship(type = "OBTAINED_MENTION", direction = Relationship.Direction.OUTGOING)
    private MontionBac montionBac;

    // Relationships to Interest nodes
    @Relationship(type = "INTERSTED_IN", direction = Relationship.Direction.OUTGOING)
    private Duree duree;

    // Relationships to Subject nodes
    @Relationship(type = "STUDIES", direction = Relationship.Direction.OUTGOING)
    private Set<Subject> subjects;

    // Relationships to CareerAspiration nodes
    @Relationship(type = "ASPIRES_TO", direction = Relationship.Direction.OUTGOING)
    private Set<CareerAspiration> careerAspirations;

}