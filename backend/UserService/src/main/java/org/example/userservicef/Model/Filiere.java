package org.example.userservicef.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Data
@Node("Filiere")
public class Filiere {
    @Id
    private String name; // e.g., "Computer Science", "Mathematics"

    public Filiere(String name) {
        this.name = name;
    }
}