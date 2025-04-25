package org.example.userservicef.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Data
@Node("Duree")
public class Duree {
    @Id
    private int name; 
    public Duree(int name) {
        this.name = name;
    }
}