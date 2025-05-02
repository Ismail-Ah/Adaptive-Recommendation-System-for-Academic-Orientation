package com.ayman.adminservice.Model;



import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

@Node("Duree")
@Data
public class Duration {
    @Id
    @GeneratedValue
    private Long id;

    private Integer years; // Example: 3, 4, 5 years

    public Integer getValue() {
        return years;
    }

    public void setValue(Integer value) {
        this.years = value;
    }
}
