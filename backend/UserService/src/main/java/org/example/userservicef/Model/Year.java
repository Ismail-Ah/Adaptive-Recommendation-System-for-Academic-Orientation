package org.example.userservicef.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Data
@Node("Year")
public class Year {
    @Id
    private String name; // e.g., "First Year Bac", "Second Year Bac"

    public Year(String name) {
        this.name = name;
    }
}