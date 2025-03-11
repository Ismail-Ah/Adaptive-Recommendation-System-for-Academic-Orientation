package org.example.userservicef.Model;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import lombok.Data;

@Node("CareerAspiration")
@Data
public class CareerAspiration {
    @Id
    private String name;

    public CareerAspiration(String name) {
        this.name = name;
    }
}