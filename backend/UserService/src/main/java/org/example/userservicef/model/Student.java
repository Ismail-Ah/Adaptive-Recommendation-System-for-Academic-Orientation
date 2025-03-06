package org.example.userservicef.model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node
@Data
public class Student {
    @Id
    private String email;
    private String name;
    private String year;
    private String interests;
    private String subjects;
}
