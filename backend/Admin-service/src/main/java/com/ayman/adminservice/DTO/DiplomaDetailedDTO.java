package com.ayman.adminservice.DTO;

import org.springframework.data.annotation.PersistenceConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class DiplomaDetailedDTO {

    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private  String nomDiplome;
    private  String ecole;
    private  List<String> career;
    private  List<String> employmentOpportunities;
    private  List<String> ancienneDiplome;
    private  List<String> filiere;
    private  Integer duree;
    private  String mentionBac;
    private  String ville;
    private  List<String> matieresDiplome;
    private  List<String> matieresEtudiant;

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

    public DiplomaDetailedDTO(String nomDiplome) {
        this.nomDiplome = nomDiplome;
    }

    @PersistenceConstructor
    public DiplomaDetailedDTO(
            String nomDiplome,
            String ecole,
            List<String> career,
            List<String> employmentOpportunities,
            List<String> ancienneDiplome,
            List<String> filiere,
            Integer duree,
            String mentionBac,
            String ville,
            List<String> matieresDiplome,
            List<String> matieresEtudiant
    ) {
        this.nomDiplome = nomDiplome != null ? nomDiplome : "N/A";
        this.ecole = ecole != null ? ecole : "";
        this.career = career != null ? career.stream().filter(Objects::nonNull).collect(Collectors.toList()) : Collections.emptyList();
        this.employmentOpportunities = employmentOpportunities != null ?
                employmentOpportunities.stream().filter(Objects::nonNull).collect(Collectors.toList()) : Collections.emptyList();
        this.ancienneDiplome = ancienneDiplome != null ?
                ancienneDiplome.stream().filter(Objects::nonNull).collect(Collectors.toList()) : Collections.emptyList();
        this.filiere = filiere != null ?
                filiere.stream().filter(Objects::nonNull).collect(Collectors.toList()) : Collections.emptyList();
        this.duree = duree;  // We allow this to be null as it's numeric
        this.mentionBac = mentionBac != null ? mentionBac : "";
        this.ville = ville != null ? ville : "";
        this.matieresDiplome = matieresDiplome != null ?
                matieresDiplome.stream().filter(Objects::nonNull).collect(Collectors.toList()) : Collections.emptyList();
        this.matieresEtudiant = matieresEtudiant != null ?
                matieresEtudiant.stream().filter(Objects::nonNull).collect(Collectors.toList()) : Collections.emptyList();
    }

    // Getters remain the same
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

    @Override
    public String toString() {
        return "DiplomaDetailedDTO{" +
                "nomDiplome='" + nomDiplome + '\'' +
                ", ecole='" + ecole + '\'' +
                ", career=" + career +
                ", employmentOpportunities=" + employmentOpportunities +
                ", ancienneDiplome=" + ancienneDiplome +
                ", filiere=" + filiere +
                ", duree=" + duree +
                ", mentionBac='" + mentionBac + '\'' +
                ", ville='" + ville + '\'' +
                ", matieresDiplome=" + matieresDiplome +
                ", matieresEtudiant=" + matieresEtudiant +
                '}';
    }

}