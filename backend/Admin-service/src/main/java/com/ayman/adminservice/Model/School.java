package com.ayman.adminservice.Model;



import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

@Node("Ecole")
@Data
public class School {
    @Id
    @GeneratedValue
    private Long id;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private String name;

    @Relationship(type = "LOCATED_IN", direction = Relationship.Direction.OUTGOING)
    private City ville;

    public City getVille() {
        return ville;
    }

    public void setVille(City ville) {
        this.ville = ville;
    }
}
