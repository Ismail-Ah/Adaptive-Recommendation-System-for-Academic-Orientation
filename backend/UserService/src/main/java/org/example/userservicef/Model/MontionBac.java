package org.example.userservicef.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Data
@Node("MontionBac")
public class MontionBac {
    @Id
    private String name; 

    public MontionBac(String name) {
        this.name = name;
    }
}