package com.ayman.adminservice.Model;



import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

@Node("Ecole")
@Data
public class School {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
}
