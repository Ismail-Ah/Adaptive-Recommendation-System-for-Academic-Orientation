package com.example.feedbackService.DTO;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
    private List<String> notes;
    private float rating;
    private boolean like;
}