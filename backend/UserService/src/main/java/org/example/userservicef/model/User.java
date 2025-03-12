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
    private String password;
    private String year;

    @Relationship(type = "INTERESTED_IN")
    private Set<Interest> interests = new HashSet<>();

    @Relationship(type = "STUDIES")
    private Set<Subject> subjects = new HashSet<>();

    @Relationship(type = "ASPIRES_TO")
    private Set<CareerAspiration> careerAspirations = new HashSet<>();
}