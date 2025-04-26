package com.ayman.adminservice.Model;



import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

@Node("Filiere")
@Data
public class Filiere {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
}
