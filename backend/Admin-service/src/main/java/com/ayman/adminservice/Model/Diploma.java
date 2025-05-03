package com.ayman.adminservice.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

import java.util.List;

@Node("Diplome") // your main diploma node
@Data
public class Diploma {

    @Id
    private String name;

    @Relationship(type = "BELONGS_TO_FILIERE", direction = Relationship.Direction.OUTGOING)
    private List<Filiere> filiere;

    @Relationship(type = "HAS_DURATION", direction = Relationship.Direction.OUTGOING)
    private Duration duree; // optional node if you model duration as a node, otherwise Integer



    @Relationship(type = "OFFERED_BY", direction = Relationship.Direction.OUTGOING)
    private School ecole;

    @Relationship(type = "LEADS_TO_CAREER", direction = Relationship.Direction.OUTGOING)
    private List<Career> careers;

    @Relationship(type = "OFFERS_OPPORTUNITY", direction = Relationship.Direction.OUTGOING)
    private List<EmploymentOpportunity> opportunities;

    @Relationship(type = "REQUIRES_MENTION", direction = Relationship.Direction.OUTGOING)
    private MentionBac mention;

    @Relationship(type = "REQUIRES_PREVIOUS", direction = Relationship.Direction.OUTGOING)
    private List<PreviousDiploma> previousDiploma; // recursive relationship

    @Relationship(type = "INCLUDES_SUBJECT", direction = Relationship.Direction.OUTGOING)
    private List<Subject> subjects;

    @Relationship(type = "REQUIRES_STUDENT_SUBJECT", direction = Relationship.Direction.OUTGOING)
    private List<EtudiantSubject> requiredStudentSubjects;

    public Duration getDuree() {
        return duree;
    }

    public void setDuree(Duration duree) {
        this.duree = duree;
    }

    public String getNomDiplome() {
        return name;
    }

    public void setNomDiplome(String nomDiplome) {
        this.name = nomDiplome;
    }

    public List<Filiere> getFiliere() {
        return filiere;
    }

    public void setFiliere(List<Filiere> filiere) {
        this.filiere = filiere;
    }

    public School getEcole() {
        return ecole;
    }

    public void setEcole(School ecole) {
        this.ecole = ecole;
    }

    public List<Career> getCareers() {
        return careers;
    }

    public void setCareers(List<Career> careers) {
        this.careers = careers;
    }

    public List<EmploymentOpportunity> getOpportunities() {
        return opportunities;
    }

    public void setOpportunities(List<EmploymentOpportunity> opportunities) {
        this.opportunities = opportunities;
    }

    public MentionBac getMention() {
        return mention;
    }

    public void setMention(MentionBac mention) {
        this.mention = mention;
    }

    public List<PreviousDiploma> getPreviousDiploma() {
        return previousDiploma;
    }

    public void setPreviousDiploma(List<PreviousDiploma> previousDiploma) {
        this.previousDiploma = previousDiploma;
    }

    public List<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<Subject> subjects) {
        this.subjects = subjects;
    }

    public List<EtudiantSubject> getRequiredStudentSubjects() {
        return requiredStudentSubjects;
    }

    public void setRequiredStudentSubjects(List<EtudiantSubject> requiredStudentSubjects) {
        this.requiredStudentSubjects = requiredStudentSubjects;
    }
}