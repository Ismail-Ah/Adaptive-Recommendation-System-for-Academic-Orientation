package org.example.userservicef.Model;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import lombok.Data;

@Node("Interest")
@Data
public class Interest {
    @Id
    private String name;

    public Interest(String name) {
        this.name = name;
    }
}