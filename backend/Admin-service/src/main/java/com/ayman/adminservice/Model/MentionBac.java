package com.ayman.adminservice.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.Data;

@Data
@Node("MentionBac")
public class MentionBac {
    @Id
    private String name;

    public String getMention() {
        return name;
    }

    public void setMention(String mention) {
        this.name = mention;
    }
}
