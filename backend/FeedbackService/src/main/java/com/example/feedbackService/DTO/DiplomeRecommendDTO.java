package com.example.feedbackService.DTO;

import java.util.Set;

import lombok.Data;

@Data
public class DiplomeRecommendDTO {
    private String Nom_Diplôme;
    private String Ville;
    private String Ecole;
    private Integer Durée;
    private String Mention_Bac;
    private Set<Integer> Ancienne_Diplome;
    private Set<String> Employement_Opportunities;
    private Set<String> Career;
    private Set<String> Filiere;
    private Set<String> Matieres_Etudiant;
    private Set<String> Matieres_Diplome;
    private Integer match_percentage;
}