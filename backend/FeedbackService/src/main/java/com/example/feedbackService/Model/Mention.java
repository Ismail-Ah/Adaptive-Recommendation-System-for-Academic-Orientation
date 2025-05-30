package com.example.feedbackService.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.Data;

@Data
@Node("Mention")
public class Mention {
    @Id
    private String mention;
}
