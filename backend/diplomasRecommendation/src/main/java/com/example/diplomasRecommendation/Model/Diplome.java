package com.example.diplomasRecommendation.Model;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

@Data
@Node("Diplome")
public class Diplome {
    @Id
    private String name;
    private String ville;
    private String ecole;
    private Integer duration;

    @Relationship(type = "SHOULD_HAVE")
    private Set<Diplome> diplomes = new HashSet<>();
    
    @Relationship(type = "HAS_MENTION")
    private Mention mention;
        
    @Relationship(type = "PROVIDE_JOB_FOR")
    private Set<EmploymentOpportunity> opportunities = new HashSet<>();
    
    @Relationship(type = "RELATED_TO")
    private Set<Career> careers = new HashSet<>();

    @Relationship(type = "HAS_FILIERE")
    private Set<Filiere> filieres = new HashSet<>();

    @Relationship(type = "INTERESTED_IN")
    private Set<MatiereEtudiant> matiereEtudiants = new HashSet<>();

    @Relationship(type = "STUDIES")
    private Set<MatiereDiplome> matiereDiplomes = new HashSet<>();

}