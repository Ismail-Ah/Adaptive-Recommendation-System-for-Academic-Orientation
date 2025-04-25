package com.example.diplomasRecommendation.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.Data;

@Data
@Node("MatiereEtudiant")
public class MatiereEtudiant {
    @Id
    private String matiere;
}
