package com.ayman.adminservice.Model;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

import java.util.List;

@Node("Diplome") // your main diploma node
@Data
public class Diploma {

    @Id
    @GeneratedValue
    private Long id;

    private String nomDiplome;

    @Relationship(type = "BELONGS_TO_FILIERE", direction = Relationship.Direction.OUTGOING)
    private Filiere filiere;

    @Relationship(type = "HAS_DURATION", direction = Relationship.Direction.OUTGOING)
    private Duration duree; // optional node if you model duration as a node, otherwise Integer

    @Relationship(type = "LOCATED_IN", direction = Relationship.Direction.OUTGOING)
    private City ville;

    @Relationship(type = "OFFERED_BY", direction = Relationship.Direction.OUTGOING)
    private School ecole;

    @Relationship(type = "LEADS_TO_CAREER", direction = Relationship.Direction.OUTGOING)
    private List<Career> careers;

    @Relationship(type = "OFFERS_OPPORTUNITY", direction = Relationship.Direction.OUTGOING)
    private List<EmploymentOpportunity> opportunities;

    @Relationship(type = "REQUIRES_MENTION", direction = Relationship.Direction.OUTGOING)
    private MentionBac mention;

    @Relationship(type = "REQUIRES_PREVIOUS", direction = Relationship.Direction.OUTGOING)
    private Diploma previousDiploma; // recursive relationship

    @Relationship(type = "INCLUDES_SUBJECT", direction = Relationship.Direction.OUTGOING)
    private List<Subject> subjects;

    @Relationship(type = "REQUIRES_STUDENT_SUBJECT", direction = Relationship.Direction.OUTGOING)
    private List<Subject> requiredStudentSubjects;
}