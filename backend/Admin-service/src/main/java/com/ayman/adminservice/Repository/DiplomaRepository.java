package com.ayman.adminservice.Repository;

import com.ayman.adminservice.DTO.DiplomaDetailedDTO;
import com.ayman.adminservice.Model.Diploma;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface DiplomaRepository extends Neo4jRepository<Diploma, Long> {
    @Query("MATCH (d:Diplome)-[:OFFERED_BY]->(:Ecole)\n" +
            "RETURN count(d) AS totalDiplomasWithSchool")
    long countDistinctDiplomas();

    @Query("MATCH (d:Diplome)-[:OFFERED_BY]->(e:Ecole) RETURN count(DISTINCT e)")
    long countDistinctSchools();

    @Query("MATCH (d:Diplome)-[:LOCATED_IN]->(v:Ville) RETURN count(DISTINCT v)")
    Integer countDistinctCities();


    @Query("MATCH (d:Diplome) RETURN avg(d.duree)")
    Double calculateAverageDuration(); // ✅ Use Object Double not primitive double

    @Query("""
    MATCH (d:Diplome)
                                   OPTIONAL MATCH (d)-[:OFFERED_BY]->(e:Ecole)
                                   OPTIONAL MATCH (d)-[:LOCATED_IN]->(v:Ville)
                                   OPTIONAL MATCH (d)-[:REQUIRES_MENTION]->(m:MentionBac)
                                   OPTIONAL MATCH (d)-[:LEADS_TO_CAREER]->(c:Career)
                                   OPTIONAL MATCH (d)-[:OFFERS_OPPORTUNITY]->(o:EmploymentOpportunity)
                                   OPTIONAL MATCH (d)-[:REQUIRES_PREVIOUS]->(p:AncienneDiplome)
                                   OPTIONAL MATCH (d)-[:BELONGS_TO_FILIERE]->(f:Filiere)
                                   OPTIONAL MATCH (d)-[:INCLUDES_SUBJECT]->(s:MatiereDiplome)
                                   OPTIONAL MATCH (d)-[:REQUIRES_STUDENT_SUBJECT]->(ss:MatiereEtudiant)
                                   OPTIONAL MATCH (d)-[:HAS_DURATION]->(dd:Duree)
            
                                   WITH d.name AS diplomaName,\s
                                        e.name AS schoolName,
                                        collect(DISTINCT c.name) AS career,
                                        collect(DISTINCT o.name) AS employmentOpportunities,
                                        collect(DISTINCT p.name) AS ancienneDiplome,
                                        collect(DISTINCT f.name) AS filiere,
                                        head(collect(dd.value)) AS duree,
                                        head(collect(m.name)) AS mentionBac,
                                        head(collect(v.name)) AS ville,
                                        collect(DISTINCT s.name) AS matieresDiplome,
                                        collect(DISTINCT ss.name) AS matieresEtudiant
                                       \s
                                   WHERE diplomaName IS NOT NULL
            
                                   RETURN\s
                                       coalesce(diplomaName, 'N/A') AS nomDiplome,
                                       coalesce(schoolName, '') AS ecole,
                                       [x IN career WHERE x IS NOT NULL] AS career,
                                       [x IN employmentOpportunities WHERE x IS NOT NULL] AS employmentOpportunities,
                                       [x IN ancienneDiplome WHERE x IS NOT NULL] AS ancienneDiplome,
                                       [x IN filiere WHERE x IS NOT NULL] AS filiere,
                                       duree,
                                       coalesce(mentionBac, '') AS mentionBac,
                                       coalesce(ville, '') AS ville,
                                       [x IN matieresDiplome WHERE x IS NOT NULL] AS matieresDiplome,
                                       [x IN matieresEtudiant WHERE x IS NOT NULL] AS matieresEtudiant
                                   ORDER BY nomDiplome, ecole
""")
    List<DiplomaDetailedDTO> findAllDiplomasDetailed();

    @Query("MATCH (d:Diplome) WHERE d.id = $id RETURN d")
    Optional<Diploma> findByCustomId(Long id);

    @Query("MATCH (d:Diplome) WHERE d.id = $id DETACH DELETE d")
    void deleteByCustomId(Long id);

    @Query("MATCH (d:Diplome) WHERE d.name = $name RETURN d")
    Optional<Diploma> findByName(String name);

    @Query("MATCH (d:Diplome) WHERE d.name = $name DETACH DELETE d")
    void deleteByName(String name);
}