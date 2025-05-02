package com.ayman.adminservice.DTO;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class DiplomaUpdateDTO {
    private String nomDiplome;
    private String ecole;
    private String ville;
    private Integer duree;
    private String mentionBac;
    private List<String> filiere;
    private List<String> career;
    private List<String> employmentOpportunities;
    private List<String> ancienneDiplome;
    private List<String> matieresDiplome;
    private List<String> matieresEtudiant;

    @JsonCreator
    public DiplomaUpdateDTO(
            @JsonProperty("nomDiplome") String nomDiplome,
            @JsonProperty("ecole") String ecole,
            @JsonProperty("ville") String ville,
            @JsonProperty("duree") Integer duree,
            @JsonProperty("mentionBac") String mentionBac,
            @JsonProperty("filiere") List<String> filiere,
            @JsonProperty("career") List<String> career,
            @JsonProperty("employmentOpportunities") List<String> employmentOpportunities,
            @JsonProperty("ancienneDiplome") List<String> ancienneDiplome,
            @JsonProperty("matieresDiplome") List<String> matieresDiplome,
            @JsonProperty("matieresEtudiant") List<String> matieresEtudiant
    ) {
        this.nomDiplome = nomDiplome;
        this.ecole = ecole;
        this.ville = ville;
        this.duree = duree;
        this.mentionBac = mentionBac;
        this.filiere = filiere;
        this.career = career;
        this.employmentOpportunities = employmentOpportunities;
        this.ancienneDiplome = ancienneDiplome;
        this.matieresDiplome = matieresDiplome;
        this.matieresEtudiant = matieresEtudiant;
    }

    public String getNomDiplome() {
        return nomDiplome;
    }

    public String getEcole() {
        return ecole;
    }

    public List<String> getCareer() {
        return career;
    }

    public List<String> getEmploymentOpportunities() {
        return employmentOpportunities;
    }

    public List<String> getAncienneDiplome() {
        return ancienneDiplome;
    }

    public List<String> getFiliere() {
        return filiere;
    }

    public Integer getDuree() {
        return duree;
    }

    public String getMentionBac() {
        return mentionBac;
    }

    public String getVille() {
        return ville;
    }

    public List<String> getMatieresDiplome() {
        return matieresDiplome;
    }

    public List<String> getMatieresEtudiant() {
        return matieresEtudiant;
    }

    public void setNomDiplome(String nomDiplome) {
        this.nomDiplome = nomDiplome;
    }

    public void setEcole(String ecole) {
        this.ecole = ecole;
    }

    public void setCareer(List<String> career) {
        this.career = career;
    }

    public void setEmploymentOpportunities(List<String> employmentOpportunities) {
        this.employmentOpportunities = employmentOpportunities;
    }

    public void setAncienneDiplome(List<String> ancienneDiplome) {
        this.ancienneDiplome = ancienneDiplome;
    }

    public void setFiliere(List<String> filiere) {
        this.filiere = filiere;
    }

    public void setDuree(Integer duree) {
        this.duree = duree;
    }

    public void setMentionBac(String mentionBac) {
        this.mentionBac = mentionBac;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public void setMatieresDiplome(List<String> matieresDiplome) {
        this.matieresDiplome = matieresDiplome;
    }

    public void setMatieresEtudiant(List<String> matieresEtudiant) {
        this.matieresEtudiant = matieresEtudiant;
    }

    public DiplomaUpdateDTO(String nomDiplome) {
        this.nomDiplome = nomDiplome;
    }
}