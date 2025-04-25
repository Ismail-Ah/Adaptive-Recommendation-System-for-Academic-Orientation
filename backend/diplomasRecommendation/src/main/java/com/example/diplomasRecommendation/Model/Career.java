package com.example.diplomasRecommendation.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.Data;

@Data
@Node("Career")
public class Career {
    @Id
    private String career;
}
