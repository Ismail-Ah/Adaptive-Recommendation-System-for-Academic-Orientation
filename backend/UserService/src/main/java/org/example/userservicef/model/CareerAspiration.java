package org.example.userservicef.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Data
@Node("CareerAspiration")
public class CareerAspiration {
    @Id
    private String name;

    public CareerAspiration(String name) {
        this.name = name;
    }
}