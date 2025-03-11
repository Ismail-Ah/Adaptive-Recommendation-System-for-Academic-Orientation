package org.example.userservicef.Model;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import lombok.Data;

@Node("Subject")
@Data
public class Subject {
    @Id
    private String name;

    public Subject(String name) {
        this.name = name;
    }
}