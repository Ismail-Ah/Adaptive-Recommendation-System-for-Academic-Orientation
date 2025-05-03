package com.example.diplomasRecommendation.Controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.diplomasRecommendation.DTO.DiplomeDTO;
import com.example.diplomasRecommendation.DTO.UserDTO;
import com.example.diplomasRecommendation.Model.Career;
import com.example.diplomasRecommendation.Model.Diplome;
import com.example.diplomasRecommendation.Model.EmploymentOpportunity;
import com.example.diplomasRecommendation.Model.Filiere;
import com.example.diplomasRecommendation.Model.MatiereDiplome;
import com.example.diplomasRecommendation.Model.MatiereEtudiant;
import com.example.diplomasRecommendation.Model.Mention;
import com.example.diplomasRecommendation.Model.QualifieForRelationship;
import com.example.diplomasRecommendation.Model.User;
import com.example.diplomasRecommendation.Service.CareerService;
import com.example.diplomasRecommendation.Service.DiplomeService;
import com.example.diplomasRecommendation.Service.EmploymentService;
import com.example.diplomasRecommendation.Service.FiliereService;
import com.example.diplomasRecommendation.Service.MatiereDiplomeService;
import com.example.diplomasRecommendation.Service.MatiereEtudService;
import com.example.diplomasRecommendation.Service.MentionService;
import com.example.diplomasRecommendation.Service.UserService;

import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpHeaders;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/")
public class UserDiplomeController {

    private static final Logger logger = LoggerFactory.getLogger(UserDiplomeController.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private DiplomeService diplomeService;

    @Autowired
    private CareerService careerService;

    @Autowired
    private FiliereService filiereService;

    @Autowired
    private MentionService mentionService;

    @Autowired
    private EmploymentService employmentService;

    @Autowired
    private MatiereDiplomeService matiereDiplomeService;

    @Autowired
    private MatiereEtudService matiereEtudService;

    @Autowired
    private UserController userController;

    @GetMapping("/recommend-gnn")
    public void recommendNewDiplomas(HttpServletRequest request) {
        logger.info("Entering recommendNewDiplomas endpoint");
        logger.info("Request headers: {}", request.getHeaderNames());
        UserDTO userDTO = userController.getUser(request);
        logger.info("Fetched UserDTO: {}", userDTO);
        GNNRecommend(userDTO);
        logger.info("Exiting recommendNewDiplomas endpoint");
    }

    @GetMapping("/recommend-gnn-all")
    public void recommendNewDiplomasAll(HttpServletRequest request) {
        logger.info("Entering recommendNewDiplomasAll endpoint");
        logger.info("Request headers: {}", request.getHeaderNames());






        String url = "http://gnn-service/api/retrain/";
        logger.info("Calling GNN service at URL: {}", url);

        // Utiliser HttpEntity sans en-têtes
        HttpEntity<Void> requestEntity = new HttpEntity<>(null);

        try {
            // Exécution de la requête GET sans en-têtes
            ResponseEntity<Void> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Void.class
            );

            logger.info("GNN retrain triggered. Response status: {}", response.getStatusCode());

        } catch (Exception e) {
            logger.error("Error calling GNN service", e);
        }





        List<UserDTO> usersDTO = userController.getAllUsers(request);
        logger.info("Fetched all users, count: {}", usersDTO.size());
        for (UserDTO user : usersDTO) {
            logger.info("Processing user: {}", user);
            GNNRecommend(user);
        }
        logger.info("Exiting recommendNewDiplomasAll endpoint");
    }

    @GetMapping("/recommend-diplomas")
    public ResponseEntity<?> recommendDiplomas(HttpServletRequest request) {
        logger.info("Entering recommendDiplomas endpoint");
        logger.info("Request headers: {}", request.getHeaderNames());

        UserDTO userDTO = userController.getUser(request);
        logger.info("Fetched UserDTO: {}", userDTO);
        logger.info("UserDTO email: {}", userDTO.getEmail());

        List<DiplomeDTO> diplomesDTO = new ArrayList<>();
        User user = userService.findByEmail(userDTO.getEmail());
        logger.info("User fetched from database: {}", user);
        if (user != null) {
            logger.info("User exists with email: {}", user.getEmail());
            List<QualifieForRelationship> relationships = user.getDiplomeRelationships();
            logger.info("Diploma relationships associated with user: {}", relationships);
            for (QualifieForRelationship relationship : relationships) {
                Diplome diplome = relationship.getDiplome();
                logger.info("Processing diplome: {}", diplome);
                DiplomeDTO diplomeDTO = new DiplomeDTO();
                diplomeDTO.setNom_Diplôme(diplome.getName());
                diplomeDTO.setVille(diplome.getVille());
                diplomeDTO.setEcole(diplome.getEcole());
                diplomeDTO.setDurée(diplome.getDuration());
                diplomeDTO.setMatch_percentage(relationship.getMatchPercentage()); // Set match percentage
                diplomeDTO.setMention_Bac(diplome.getMention() != null ? diplome.getMention().getMention() : null);
                logger.info("Set Mention_Bac: {}", diplomeDTO.getMention_Bac());

                diplomeDTO.setAncienne_Diplome(diplome.getDiplomes() != null ?
                        diplome.getDiplomes().stream()
                                .map(Diplome::getName)
                                .collect(Collectors.toSet()) : new HashSet<>());
                logger.info("Set Ancienne_Diplome: {}", diplomeDTO.getAncienne_Diplome());

                diplomeDTO.setEmployement_Opportunities(diplome.getOpportunities() != null ?
                        diplome.getOpportunities().stream()
                                .map(EmploymentOpportunity::getOppotunity)
                                .collect(Collectors.toSet()) : new HashSet<>());
                logger.info("Set Employement_Opportunities: {}", diplomeDTO.getEmployement_Opportunities());

                diplomeDTO.setCareer(diplome.getCareers() != null ?
                        diplome.getCareers().stream()
                                .map(Career::getCareer)
                                .collect(Collectors.toSet()) : new HashSet<>());
                logger.info("Set Career: {}", diplomeDTO.getCareer());

                diplomeDTO.setFiliere(diplome.getFilieres() != null ?
                        diplome.getFilieres().stream()
                                .map(Filiere::getFiliere)
                                .collect(Collectors.toSet()) : new HashSet<>());
                logger.info("Set Filiere: {}", diplomeDTO.getFiliere());

                diplomeDTO.setMatieres_Etudiant(diplome.getMatiereEtudiants() != null ?
                        diplome.getMatiereEtudiants().stream()
                                .map(MatiereEtudiant::getMatiere)
                                .collect(Collectors.toSet()) : new HashSet<>());
                logger.info("Set Matieres_Etudiant: {}", diplomeDTO.getMatieres_Etudiant());

                diplomeDTO.setMatieres_Diplome(diplome.getMatiereDiplomes() != null ?
                        diplome.getMatiereDiplomes().stream()
                                .map(MatiereDiplome::getMatiere)
                                .collect(Collectors.toSet()) : new HashSet<>());
                logger.info("Set Matieres_Diplome: {}", diplomeDTO.getMatieres_Diplome());

                diplomesDTO.add(diplomeDTO);
                logger.info("Added diplomeDTO to list: {}", diplomeDTO);
            }
        } else {
            logger.info("User does not exist for email: {}", userDTO.getEmail());
            diplomesDTO = GNNRecommend(userDTO);
            logger.info("GNNRecommend returned: {}", diplomesDTO);
        }

        if (diplomesDTO.isEmpty()) {
            logger.warn("No diplomas found or recommended for user: {}", userDTO.getEmail());
            return ResponseEntity.ok().body("No diploma recommendations available");
        }

        logger.info("Returning diplomesDTO: {}", diplomesDTO);
        logger.info("Exiting recommendDiplomas endpoint");
        return ResponseEntity.ok(diplomesDTO);
    }
    private List<DiplomeDTO> GNNRecommend(UserDTO userDTO) {
        logger.info("Entering GNNRecommend for userDTO: {}", userDTO);

        String url = "http://gnn-service/api/recommend/";
        logger.info("GNN service URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        logger.info("Headers set: {}", headers);

        Map<String, Object> body = new HashMap<>();
        body.put("Matieres_Etudiant", userDTO.getSubjects());
        body.put("Career", userDTO.getCareerAspirations());
        body.put("Filiere", userDTO.getFiliere());
        body.put("Durée", userDTO.getDuree());
        body.put("Mention_Bac", userDTO.getMontionBac());
        logger.info("Request body prepared: {}", body);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        logger.info("HttpEntity created for request");

        ResponseEntity<List<DiplomeDTO>> diplomas = restTemplate.exchange(
            url,
            HttpMethod.POST,
            request,
            new ParameterizedTypeReference<List<DiplomeDTO>>() {}
        );
        logger.info("GNN service response: {}", diplomas);

        List<DiplomeDTO> diplomasBody = diplomas.getBody();
        logger.info("Extracted diplomas body: {}", diplomasBody);

        storeDiplomasAndUser(diplomasBody, userDTO.getEmail());
        logger.info("Stored diplomas and user for email: {}", userDTO.getEmail());

        logger.info("Exiting GNNRecommend, returning: {}", diplomasBody);
        return diplomasBody;
    }

    @Transactional
    private void storeDiplomasAndUser(List<DiplomeDTO> diplomasDTO, String email) {
        logger.info("Entering storeDiplomasAndUser for email: {}", email);
        logger.info("DiplomasDTO to store: {}", diplomasDTO);

        List<QualifieForRelationship> diplomeRelationships = new ArrayList<>();

        // Step 1: Fetch or create the user
        User user = userService.findByEmail(email);
        if (user == null) {
            logger.info("User not found, creating new user with email: {}", email);
            user = new User();
            user.setEmail(email);
            user.setDiplomeRelationships(new ArrayList<>());
        } else {
            logger.info("User found: {}", user);
            // Step 2: Delete existing diploma relationships
            List<QualifieForRelationship> existingRelationships = user.getDiplomeRelationships();
            if (existingRelationships != null && !existingRelationships.isEmpty()) {
                logger.info("Deleting {} existing diploma relationships for user: {}", existingRelationships.size(), email);
                for (QualifieForRelationship relationship : existingRelationships) {
                    diplomeService.delete(relationship.getDiplome());
                    logger.info("Deleted diploma: {}", relationship.getDiplome().getName());
                }
            }
            user.setDiplomeRelationships(new ArrayList<>());
        }

        // Step 3: Process and save new diplomas
        for (DiplomeDTO diplomeDTO : diplomasDTO) {
            try {
                logger.info("Processing diplomeDTO: {}", diplomeDTO);
                Diplome diplome = new Diplome();
                diplome.setName(diplomeDTO.getNom_Diplôme());
                diplome.setVille(diplomeDTO.getVille() != null ? diplomeDTO.getVille() : "Unknown");
                diplome.setEcole(diplomeDTO.getEcole() != null ? diplomeDTO.getEcole() : "Unknown");
                diplome.setDuration(diplomeDTO.getDurée() != null ? diplomeDTO.getDurée() : 0);
                logger.info("Created diplome: name={}, ville={}, ecole={}, duration={}",
                        diplome.getName(), diplome.getVille(), diplome.getEcole(), diplome.getDuration());

                // Handle Mention
                Mention mention = mentionService.findByName(diplomeDTO.getMention_Bac());
                if (mention == null && diplomeDTO.getMention_Bac() != null) {
                    mention = new Mention();
                    mention.setMention(diplomeDTO.getMention_Bac());
                    mentionService.save(mention);
                    logger.info("Created and saved new mention: {}", mention);
                }
                diplome.setMention(mention);
                logger.info("Set mention for diplome: {}", mention);

                // Handle Ancienne Diplome
                Set<Diplome> diplomeSet = diplomeDTO.getAncienne_Diplome() != null ?
                        diplomeDTO.getAncienne_Diplome().stream()
                                .filter(name -> name != null && !name.trim().isEmpty())
                                .map(name -> {
                                    logger.info("Processing ancienne diplome with name: {}", name);
                                    Diplome d = diplomeService.findByName(name);
                                    if (d == null) {
                                        d = new Diplome();
                                        d.setName(name);
                                        d.setVille("Unknown");
                                        d.setEcole("Unknown");
                                        d.setDuration(0);
                                        d.setMatiereEtudiants(new HashSet<>());
                                        d.setDiplomes(new HashSet<>());
                                        d.setMatiereDiplomes(new HashSet<>());
                                        diplomeService.save(d);
                                    }
                                    return d;
                                })
                                .collect(Collectors.toSet()) : new HashSet<>();
                diplome.setDiplomes(diplomeSet);

                // Handle Employment Opportunities
                Set<EmploymentOpportunity> opportunities = diplomeDTO.getEmployement_Opportunities() != null ?
                        diplomeDTO.getEmployement_Opportunities().stream()
                                .filter(opp -> opp != null && !opp.trim().isEmpty())
                                .map(opp -> {
                                    logger.info("Fetching employment opportunity: {}", opp);
                                    EmploymentOpportunity e = employmentService.findByName(opp);
                                    if (e == null) {
                                        e = new EmploymentOpportunity();
                                        e.setOppotunity(opp);
                                        employmentService.save(e);
                                        logger.info("Created and saved new employment opportunity: {}", e);
                                    }
                                    return e;
                                })
                                .collect(Collectors.toSet()) : new HashSet<>();
                diplome.setOpportunities(opportunities);
                logger.info("Set opportunities: {}", opportunities);

                // Handle Careers
                Set<Career> careers = diplomeDTO.getCareer() != null ?
                        diplomeDTO.getCareer().stream()
                                .filter(careerName -> careerName != null && !careerName.trim().isEmpty())
                                .map(careerName -> {
                                    logger.info("Fetching career: {}", careerName);
                                    Career c = careerService.findByName(careerName);
                                    if (c == null) {
                                        c = new Career();
                                        c.setCareer(careerName);
                                        careerService.save(c);
                                        logger.info("Created and saved new career: {}", c);
                                    }
                                    return c;
                                })
                            
                                .collect(Collectors.toSet()) : new HashSet<>();
                diplome.setCareers(careers);
                logger.info("Set careers: {}", careers);

                // Handle Filieres
                Set<Filiere> filieres = diplomeDTO.getFiliere() != null ?
                        diplomeDTO.getFiliere().stream()
                                .filter(fil -> fil != null && !fil.trim().isEmpty())
                                .map(fil -> {
                                    logger.info("Fetching filiere: {}", fil);
                                    Filiere f = filiereService.findByName(fil);
                                    if (f == null) {
                                        f = new Filiere();
                                        f.setFiliere(fil);
                                        filiereService.save(f);
                                        logger.info("Created and saved new filiere: {}", f);
                                    }
                                    return f;
                                })
                                .collect(Collectors.toSet()) : new HashSet<>();
                diplome.setFilieres(filieres);
                logger.info("Set filieres: {}", filieres);

                // Handle MatiereEtudiant
                Set<MatiereEtudiant> matiereEtudiants = diplomeDTO.getMatieres_Etudiant() != null ?
                        diplomeDTO.getMatieres_Etudiant().stream()
                                .filter(mat -> mat != null && !mat.trim().isEmpty())
                                .map(mat -> {
                                    logger.info("Fetching matiereEtudiant: {}", mat);
                                    MatiereEtudiant m = matiereEtudService.findByName(mat);
                                    if (m == null) {
                                        m = new MatiereEtudiant();
                                        m.setMatiere(mat);
                                        matiereEtudService.save(m);
                                        logger.info("Created and saved new matiereEtudiant: {}", m);
                                    }
                                    return m;
                                })
                                .collect(Collectors.toSet()) : new HashSet<>();
                diplome.setMatiereEtudiants(matiereEtudiants);
                logger.info("Set matiereEtudiants: {}", matiereEtudiants);

                // Handle MatiereDiplome
                Set<MatiereDiplome> matiereDiplomes = diplomeDTO.getMatieres_Diplome() != null ?
                        diplomeDTO.getMatieres_Diplome().stream()
                                .filter(mat -> mat != null && !mat.trim().isEmpty())
                                .map(mat -> {
                                    logger.info("Fetching matiereDiplome: {}", mat);
                                    MatiereDiplome m = matiereDiplomeService.findByName(mat);
                                    if (m == null) {
                                        m = new MatiereDiplome();
                                        m.setMatiere(mat);
                                        matiereDiplomeService.save(m);
                                        logger.info("Created and saved new matiereDiplome: {}", m);
                                    }
                                    return m;
                                })
                                .collect(Collectors.toSet()) : new HashSet<>();
                diplome.setMatiereDiplomes(matiereDiplomes);
                logger.info("Set matiereDiplomes: {}", matiereDiplomes);

                // Save the diploma
                diplomeService.save(diplome);

                // Create the relationship with match_percentage
                Double matchPercentage = diplomeDTO.getMatch_percentage() != null ? diplomeDTO.getMatch_percentage() : 0.0;
                QualifieForRelationship relationship = new QualifieForRelationship(diplome, matchPercentage);
                diplomeRelationships.add(relationship);
                logger.info("Added relationship for diplome: {} with matchPercentage: {}", diplome.getName(), matchPercentage);
            } catch (Exception e) {
                logger.error("Failed to process diplomeDTO: {}. Continuing with next diploma.", diplomeDTO.getNom_Diplôme(), e);
            }
        }

        // Step 4: Associate new diploma relationships with the user and save
        try {
            user.setDiplomeRelationships(diplomeRelationships);
            logger.info("User prepared with {} diploma relationships: {}", diplomeRelationships.size(), user);
            userService.save(user);
            logger.info("Saved user: {}", user);
        } catch (Exception e) {
            logger.error("Failed to save user: {}", email, e);
            throw new RuntimeException("Failed to save user", e);
        }

        logger.info("Exiting storeDiplomasAndUser with {} diploma relationships saved", diplomeRelationships.size());
    }
}