package com.ayman.adminservice.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.Data;

@Data
@Node("EmploymentOpportunity")
public class EmploymentOpportunity{
    @Id
    private String name;

    public String getOppotunity() {
        return name;
    }

    public void setOppotunity(String oppotunity) {
        this.name = oppotunity;
    }
}