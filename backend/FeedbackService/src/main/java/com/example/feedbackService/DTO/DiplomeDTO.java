package com.example.feedbackService.DTO;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class DiplomeDTO {
    @JsonProperty("Nom_Diplôme")
    private String nom_Diplôme;

    @JsonProperty("Ecole")
    private String ecole;

    @JsonProperty("Ville")
    private String ville;

    @JsonProperty("Durée")
    private Integer durée;

    @JsonProperty("Matieres_Diplome")
    private Set<String> matieres_Diplome;

    @JsonProperty("Ancienne_Diplome")
    private Set<String> ancienne_Diplome; 

    @JsonProperty("Employement_Opportunities")
    private Set<String> employement_Opportunities;

    @JsonProperty("Matieres_Etudiant")
    private Set<String> matieres_Etudiant;

    @JsonProperty("Career")
    private Set<String> career;

    @JsonProperty("Filiere")
    private Set<String> filiere;

    @JsonProperty("Mention_Bac")
    private String mention_Bac;

    @JsonProperty("match_percentage")
    private Double match_percentage;
}