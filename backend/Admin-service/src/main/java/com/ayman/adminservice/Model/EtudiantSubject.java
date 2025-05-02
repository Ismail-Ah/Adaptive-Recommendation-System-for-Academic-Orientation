package com.ayman.adminservice.Model;



import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

@Node("MatiereEtudiant") // If you are using the MatiereDiplome node label
@Data
public class EtudiantSubject {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
