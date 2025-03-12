package org.example.userservicef.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Data
@Node("Interest")
public class Interest {
    @Id
    private String name;  // Assuming 'name' is the key property

    public Interest(String name) {
        this.name = name;
    }
}