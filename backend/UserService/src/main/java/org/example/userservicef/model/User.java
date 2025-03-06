package org.example.userservicef.model;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import lombok.Data;

@Node("User")
@Data
public class User {
    @Id
    private String email;
    private String password;
    private String name;
}