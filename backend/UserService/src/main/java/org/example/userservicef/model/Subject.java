package org.example.userservicef.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Data
@Node("Subject")
public class Subject {
    @Id
    private String name;

    public Subject(String name) {
        this.name = name;
    }
}