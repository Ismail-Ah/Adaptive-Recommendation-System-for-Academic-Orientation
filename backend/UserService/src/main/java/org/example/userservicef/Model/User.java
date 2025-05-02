package org.example.userservicef.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.HashSet;
import java.util.Set;

@Data
@Node("User")
public class User {
    @Id
    private String email;
    private String name;
    private String role;
    private String password;

    @Relationship(type = "ENROLLED_IN_YEAR")
    private Year year; // Relationship to Year node

    @Relationship(type = "STUDIES_FILIERE")
    private Filiere filiere; // Relationship to Filiere node

    @Relationship(type = "INTERESTED_IN")
    private Duree duree;

    @Relationship(type = "OBTAINED_MENTION")
    private MontionBac montionBac;

    @Relationship(type = "STUDIES")
    private Set<Subject> subjects = new HashSet<>();

    @Relationship(type = "ASPIRES_TO")
    private Set<CareerAspiration> careerAspirations = new HashSet<>();
}