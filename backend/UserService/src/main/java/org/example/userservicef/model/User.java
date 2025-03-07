package org.example.userservicef.model;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import lombok.Data;

import java.util.List;

@Node("User")
@Data
public class User {
    @Id
    private String id; // Assuming id is a string in Neo4j
    private String email;
    private String name;
    private String password;
    private String year;
    private List<String> interests;
    private List<String> subjects;
}