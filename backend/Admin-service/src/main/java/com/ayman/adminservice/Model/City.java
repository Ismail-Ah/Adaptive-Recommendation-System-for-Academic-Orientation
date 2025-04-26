package com.ayman.adminservice.Model;



import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

@Node("Ville")
@Data
public class City {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
}
