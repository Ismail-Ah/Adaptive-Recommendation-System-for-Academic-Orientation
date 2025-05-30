package org.example.userservicef.Model;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import lombok.Data;

import java.util.Set; 

@Node("User") 
@Data
public class User {
    @Id
    private String email; 

    private String name;
    private String password; 
    private String year;
    private String role;

    @Relationship(type = "INTERESTED_IN", direction = Relationship.Direction.OUTGOING)
    private Set<Interest> interests;

    @Relationship(type = "STUDIES_FILIERE", direction = Relationship.Direction.OUTGOING)
    private Filiere filiere;

    @Relationship(type = "OBTAINED_MENTION", direction = Relationship.Direction.OUTGOING)
    private MontionBac montionBac;

    @Relationship(type = "INTERSTED_IN", direction = Relationship.Direction.OUTGOING)
    private Duree duree;

    @Relationship(type = "STUDIES", direction = Relationship.Direction.OUTGOING)
    private Set<Subject> subjects;

    @Relationship(type = "ASPIRES_TO", direction = Relationship.Direction.OUTGOING)
    private Set<CareerAspiration> careerAspirations;

}