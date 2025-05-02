package com.ayman.adminservice.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.Data;

@Data
@Node("Career")
public class Career {
    @Id
    private String name;

    public String getCareer() {
        return name;
    }

    public void setCareer(String career) {
        this.name = career;
    }
}
