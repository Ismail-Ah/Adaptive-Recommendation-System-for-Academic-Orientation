package com.ayman.adminservice.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Data
@Node("AncienneDiplome")
public class PreviousDiploma {
    @Id
    private String name;

    public String getAncienneDiplome() {
        return name;
    }

    public void setAncienneDiplome(String career) {
        this.name = career;
    }
}
