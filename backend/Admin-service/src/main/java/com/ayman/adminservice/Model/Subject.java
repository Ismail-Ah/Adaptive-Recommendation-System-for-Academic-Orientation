package com.ayman.adminservice.Model;



import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

@Node("MatiereDiplome") // If you are using the MatiereDiplome node label
@Data
public class Subject {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
}
