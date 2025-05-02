package com.ayman.adminservice.Service;

import com.ayman.adminservice.DTO.DiplomaDetailedDTO;
import com.ayman.adminservice.DTO.DiplomaUpdateDTO;
import com.ayman.adminservice.Model.*;
import com.ayman.adminservice.Repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DiplomaService {
    private static final Logger logger = LoggerFactory.getLogger(DiplomaService.class);
    private final DiplomaRepository diplomaRepository;
    private final SchoolRepository schoolRepository;
    private final FiliereRepository filiereRepository;
    private final CareerRepository careerRepository;
    private final EmploymentOpportunityRepository opportunityRepository;
    private final PreviousDiplomaRepository previousDiplomaRepository;
    private final SubjectRepository subjectRepository;
    private final EtudiantSubjectRepository etudiantSubjectRepository;
    private final DurationRepository durationRepository;
    private final MentionBacRepository mentionBacRepository;

    public DiplomaService(
            DiplomaRepository diplomaRepository,
            SchoolRepository schoolRepository,
            FiliereRepository filiereRepository,
            CareerRepository careerRepository,
            EmploymentOpportunityRepository opportunityRepository,
            PreviousDiplomaRepository previousDiplomaRepository,
            SubjectRepository subjectRepository,
            EtudiantSubjectRepository etudiantSubjectRepository,
            DurationRepository durationRepository,
            MentionBacRepository mentionBacRepository
    ) {
        this.diplomaRepository = diplomaRepository;
        this.schoolRepository = schoolRepository;
        this.filiereRepository = filiereRepository;
        this.careerRepository = careerRepository;
        this.opportunityRepository = opportunityRepository;
        this.previousDiplomaRepository = previousDiplomaRepository;
        this.subjectRepository = subjectRepository;
        this.etudiantSubjectRepository = etudiantSubjectRepository;
        this.durationRepository = durationRepository;
        this.mentionBacRepository = mentionBacRepository;
    }

    public List<Diploma> getAllDiplomas() {
        return diplomaRepository.findAll();
    }

    public Optional<Diploma> getDiplomaById(Long id) {
        return diplomaRepository.findById(id);
    }

    public Diploma saveDiploma(Diploma diploma) {
        return diplomaRepository.save(diploma);
    }

    public long getTotalDiplomas() {
        return diplomaRepository.countDistinctDiplomas();
    }

    public long getTotalSchools() {
        return diplomaRepository.countDistinctSchools();
    }

    public int getTotalCities() {
        return diplomaRepository.countDistinctCities();
    }

    public double getAverageDuration() {
        return diplomaRepository.calculateAverageDuration();
    }

    public List<DiplomaDetailedDTO> getAllDiplomasDetailed() {
        return diplomaRepository.findAllDiplomasDetailed();
    }

    public List<Diploma> getAllDiplomas2() {
        return diplomaRepository.findAll();
    }

    @Transactional
    public void deleteDiplomaByName(String name) {
        logger.info("Attempting to delete diploma with name: {}", name);
        Optional<Diploma> diplomaOptional = diplomaRepository.findByName(name);
        if (diplomaOptional.isEmpty()) {
            logger.error("Diploma with name {} not found in the database.", name);
            throw new IllegalArgumentException("Diploma with name " + name + " does not exist.");
        }
        Diploma diploma = diplomaOptional.get();
        logger.info("Diploma found: {}", diploma.getNomDiplome());

        diplomaRepository.deleteByName(name);
        logger.info("Delete operation executed for diploma with name: {}", name);

        Optional<Diploma> afterDelete = diplomaRepository.findByName(name);
        if (afterDelete.isPresent()) {
            logger.error("Failed to delete diploma with name {}. Node still exists in the database.", name);
            throw new RuntimeException("Failed to delete diploma with name " + name + ". Node still exists.");
        }
        logger.info("Diploma with name {} deleted successfully and verified.", name);
    }

    public Diploma findByName(String name) {
        return diplomaRepository.findByName(name).orElse(null);
    }

    @Transactional
    public Diploma updateDiploma(String oldName, DiplomaUpdateDTO diplomaDTO) {
        logger.info("Attempting to update diploma with name: {}", oldName);
        Optional<Diploma> diplomaOptional = diplomaRepository.findByName(oldName);
        if (diplomaOptional.isEmpty()) {
            logger.error("Diploma with name {} not found.", oldName);
            throw new IllegalArgumentException("Diploma with name " + oldName + " does not exist.");
        }

        Diploma diploma = diplomaOptional.get();
        logger.info("Diploma found: {}", diploma.getNomDiplome());

        // Update basic fields
        diploma.setNomDiplome(diplomaDTO.getNomDiplome());

        // Update School and Ville
        if (diplomaDTO.getEcole() != null && diplomaDTO.getVille() != null) {
            School school = findOrCreateSchool(diplomaDTO.getEcole(), diplomaDTO.getVille());
            diploma.setEcole(school);
        }

        // Update Duration
        if (diplomaDTO.getDuree() != null) {
            Duration duration = findOrCreateDuration(diplomaDTO.getDuree());
            diploma.setDuree(duration);
        }

        // Update MentionBac
        if (diplomaDTO.getMentionBac() != null) {
            MentionBac mention = findOrCreateMention(diplomaDTO.getMentionBac());
            diploma.setMention(mention);
        }

        // Update Filiere
        List<Filiere> filieres = diplomaDTO.getFiliere() != null
                ? diplomaDTO.getFiliere().stream()
                .map(this::findOrCreateFiliere)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setFiliere(filieres);

        // Update Careers
        List<Career> careers = diplomaDTO.getCareer() != null
                ? diplomaDTO.getCareer().stream()
                .map(this::findOrCreateCareer)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setCareers(careers);

        // Update Employment Opportunities
        List<EmploymentOpportunity> opportunities = diplomaDTO.getEmploymentOpportunities() != null
                ? diplomaDTO.getEmploymentOpportunities().stream()
                .map(this::findOrCreateOpportunity)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setOpportunities(opportunities);

        // Update Previous Diplomas
        List<PreviousDiploma> previousDiplomas = diplomaDTO.getAncienneDiplome() != null
                ? diplomaDTO.getAncienneDiplome().stream()
                .map(this::findOrCreatePreviousDiploma)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setPreviousDiploma(previousDiplomas);

        // Update Subjects
        List<Subject> subjects = diplomaDTO.getMatieresDiplome() != null
                ? diplomaDTO.getMatieresDiplome().stream()
                .map(this::findOrCreateSubject)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setSubjects(subjects);

        // Update Required Student Subjects
        List<EtudiantSubject> studentSubjects = diplomaDTO.getMatieresEtudiant() != null
                ? diplomaDTO.getMatieresEtudiant().stream()
                .map(this::findOrCreateEtudiantSubject)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setRequiredStudentSubjects(studentSubjects);

        // Save the updated diploma
        Diploma updatedDiploma = diplomaRepository.save(diploma);
        logger.info("Diploma with name {} updated successfully.", diplomaDTO.getNomDiplome());
        return updatedDiploma;
    }

    public School findOrCreateSchool(String name, String villeName) {
        Optional<School> schoolOptional = schoolRepository.findByName(name);
        if (schoolOptional.isPresent()) {
            return schoolOptional.get();
        }
        School school = new School();
        school.setName(name);
        if (villeName != null) {
            City ville = new City();
            ville.setName(villeName);
            school.setVille(ville);
        }
        return schoolRepository.save(school);
    }

    public Filiere findOrCreateFiliere(String name) {
        return filiereRepository.findByName(name)
                .orElseGet(() -> {
                    Filiere filiere = new Filiere();
                    filiere.setName(name);
                    return filiereRepository.save(filiere);
                });
    }

    public Career findOrCreateCareer(String name) {
        return careerRepository.findByName(name)
                .orElseGet(() -> {
                    Career career = new Career();
                    career.setCareer(name);
                    return careerRepository.save(career);
                });
    }

    public EmploymentOpportunity findOrCreateOpportunity(String name) {
        return opportunityRepository.findByName(name)
                .orElseGet(() -> {
                    EmploymentOpportunity opportunity = new EmploymentOpportunity();
                    opportunity.setOppotunity(name);
                    return opportunityRepository.save(opportunity);
                });
    }

    public PreviousDiploma findOrCreatePreviousDiploma(String name) {
        return previousDiplomaRepository.findByName(name)
                .orElseGet(() -> {
                    PreviousDiploma previousDiploma = new PreviousDiploma();
                    previousDiploma.setAncienneDiplome(name);
                    return previousDiplomaRepository.save(previousDiploma);
                });
    }

    public Subject findOrCreateSubject(String name) {
        return subjectRepository.findByName(name)
                .orElseGet(() -> {
                    Subject subject = new Subject();
                    subject.setName(name);
                    return subjectRepository.save(subject);
                });
    }

    public EtudiantSubject findOrCreateEtudiantSubject(String name) {
        return etudiantSubjectRepository.findByName(name)
                .orElseGet(() -> {
                    EtudiantSubject subject = new EtudiantSubject();
                    subject.setName(name);
                    return etudiantSubjectRepository.save(subject);
                });
    }

    public Duration findOrCreateDuration(Integer years) {
        return durationRepository.findByYears(years)
                .orElseGet(() -> {
                    Duration duration = new Duration();
                    duration.setValue(years);
                    return durationRepository.save(duration);
                });
    }

    public MentionBac findOrCreateMention(String mention) {
        return mentionBacRepository.findByName(mention)
                .orElseGet(() -> {
                    MentionBac mentionBac = new MentionBac();
                    mentionBac.setMention(mention);
                    return mentionBacRepository.save(mentionBac);
                });
    }

    @Transactional
    public Diploma createDiploma(DiplomaUpdateDTO diplomaDTO) {
        logger.info("Creating new diploma with name: {}", diplomaDTO.getNomDiplome());

        // Check if diploma already exists
        Optional<Diploma> existingDiploma = diplomaRepository.findByName(diplomaDTO.getNomDiplome());
        if (existingDiploma.isPresent()) {
            logger.error("Diploma with name {} already exists.", diplomaDTO.getNomDiplome());
            throw new IllegalArgumentException("Diploma with name " + diplomaDTO.getNomDiplome() + " already exists.");
        }

        Diploma diploma = new Diploma();
        diploma.setNomDiplome(diplomaDTO.getNomDiplome());

        // Set School and Ville
        if (diplomaDTO.getEcole() != null && diplomaDTO.getVille() != null) {
            School school = findOrCreateSchool(diplomaDTO.getEcole(), diplomaDTO.getVille());
            diploma.setEcole(school);
        }

        // Set Duration
        if (diplomaDTO.getDuree() != null) {
            Duration duration = findOrCreateDuration(diplomaDTO.getDuree());
            diploma.setDuree(duration);
        }

        // Set MentionBac
        if (diplomaDTO.getMentionBac() != null) {
            MentionBac mention = findOrCreateMention(diplomaDTO.getMentionBac());
            diploma.setMention(mention);
        }

        // Set Filiere
        List<Filiere> filieres = diplomaDTO.getFiliere() != null
                ? diplomaDTO.getFiliere().stream()
                .map(this::findOrCreateFiliere)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setFiliere(filieres);

        // Set Careers
        List<Career> careers = diplomaDTO.getCareer() != null
                ? diplomaDTO.getCareer().stream()
                .map(this::findOrCreateCareer)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setCareers(careers);

        // Set Employment Opportunities
        List<EmploymentOpportunity> opportunities = diplomaDTO.getEmploymentOpportunities() != null
                ? diplomaDTO.getEmploymentOpportunities().stream()
                .map(this::findOrCreateOpportunity)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setOpportunities(opportunities);

        // Set Previous Diplomas
        List<PreviousDiploma> previousDiplomas = diplomaDTO.getAncienneDiplome() != null
                ? diplomaDTO.getAncienneDiplome().stream()
                .map(this::findOrCreatePreviousDiploma)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setPreviousDiploma(previousDiplomas);

        // Set Subjects
        List<Subject> subjects = diplomaDTO.getMatieresDiplome() != null
                ? diplomaDTO.getMatieresDiplome().stream()
                .map(this::findOrCreateSubject)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setSubjects(subjects);

        // Set Required Student Subjects
        List<EtudiantSubject> studentSubjects = diplomaDTO.getMatieresEtudiant() != null
                ? diplomaDTO.getMatieresEtudiant().stream()
                .map(this::findOrCreateEtudiantSubject)
                .collect(Collectors.toList())
                : new ArrayList<>();
        diploma.setRequiredStudentSubjects(studentSubjects);

        // Save the new diploma
        Diploma createdDiploma = diplomaRepository.save(diploma);
        logger.info("Diploma with name {} created successfully.", diplomaDTO.getNomDiplome());
        return createdDiploma;
    }
}