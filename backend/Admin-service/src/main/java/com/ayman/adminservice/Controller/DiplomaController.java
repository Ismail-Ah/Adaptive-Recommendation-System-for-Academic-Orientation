package com.ayman.adminservice.Controller;

import com.ayman.adminservice.DTO.DiplomaUpdateDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.ayman.adminservice.DTO.DiplomaDetailedDTO;
import com.ayman.adminservice.Model.*;
import com.ayman.adminservice.Repository.CareerRepository;
import com.ayman.adminservice.Repository.DurationRepository;
import com.ayman.adminservice.Repository.EtudiantSubjectRepository;
import com.ayman.adminservice.Repository.FiliereRepository;
import com.ayman.adminservice.Repository.MentionBacRepository;
import com.ayman.adminservice.Service.DiplomaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/diplomas")
@CrossOrigin(origins = "*") // Allow frontend (React) access
public class DiplomaController {

    @Autowired
    private CareerRepository careerRepository;

    @Autowired
    private EtudiantSubjectRepository etudiantSubjectRepository;

    @Autowired
    private DurationRepository durationRepository;

    @Autowired
    private FiliereRepository filiereRepository;

    @Autowired
    private MentionBacRepository mentionBacRepository;

    private final DiplomaService diplomaService;

    public DiplomaController(DiplomaService diplomaService) {
        this.diplomaService = diplomaService;
    }

    @GetMapping
    public List<Diploma> getAllDiplomas() {
        return diplomaService.getAllDiplomas();
    }

    

    @GetMapping("/careers")
    public ResponseEntity<List<String>> getCareerNames() {
        List<String> careerNames = careerRepository.findAll()
            .stream()
            .map(Career::getName) // Assuming your Career entity has a getName() method
            .collect(Collectors.toList());
        return ResponseEntity.ok(careerNames);
    }

    @GetMapping("/durees")
    public ResponseEntity<List<Integer>> getDurees() {
        List<Integer> durees = durationRepository.findAll()
            .stream()
            .map(Duration::getValue) // Assuming your Career entity has a getName() method
            .collect(Collectors.toList());
        return ResponseEntity.ok(durees);
    }

    @GetMapping("/filiers")
    public ResponseEntity<List<String>> getFiliers() {
        List<String> filieres = filiereRepository.findAll()
            .stream()
            .map(Filiere::getName) // Assuming your Career entity has a getName() method
            .collect(Collectors.toList());
        return ResponseEntity.ok(filieres);
    }

    @GetMapping("/subjects-etud")
    public ResponseEntity<List<String>> getSubjectsEtud() {
        List<String> subjects = etudiantSubjectRepository.findAll()
            .stream()
            .map(EtudiantSubject::getName) // Assuming your Career entity has a getName() method
            .collect(Collectors.toList());
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/mentions")
    public ResponseEntity<List<String>> getMention() {
        List<String> mentions = mentionBacRepository.findAll()
            .stream()
            .map(MentionBac::getName) // Assuming your Career entity has a getName() method
            .collect(Collectors.toList());
        return ResponseEntity.ok(mentions);
    }

    @PostMapping
    public Diploma createDiploma(@RequestBody Diploma diploma) {
        return diplomaService.saveDiploma(diploma);
    }



    @GetMapping("/statistics/total-diplomas")
    public long getTotalDiplomas() {
        return diplomaService.getTotalDiplomas();
    }

    @GetMapping("/statistics/total-schools")
    public long getTotalSchools() {
        return diplomaService.getTotalSchools();
    }

    @GetMapping("/statistics/total-cities")
    public ResponseEntity<?> getTotalCities() {
        return ResponseEntity.ok(diplomaService.getTotalCities());
    }

    @GetMapping("/statistics/average-duration")
    public double getAverageDuration() {
        return diplomaService.getAverageDuration();
    }


    // ✅ New endpoint for detailed diplomas
    @GetMapping("/detailed")
    public List<DiplomaDetailedDTO> getAllDiplomasDetailed() {
        return diplomaService.getAllDiplomasDetailed();
    }
    @GetMapping("/diplomas")
    public List<DiplomaDetailedDTO> getAllDiplomas2() {
        List<Diploma> diplomas = diplomaService.getAllDiplomas();
        List<DiplomaDetailedDTO> diplomaDetailedDTOS = new ArrayList<>();

        for (Diploma d : diplomas) {
            DiplomaDetailedDTO diplomaDetailedDTO = new DiplomaDetailedDTO(d.getNomDiplome());

            // Handle non-collection fields with null checks

            
            diplomaDetailedDTO.setId(110l);
            
            if (d.getEcole() != null) {
                diplomaDetailedDTO.setEcole(d.getEcole().getName());
            }

            if (d.getDuree() != null) {
                diplomaDetailedDTO.setDuree(d.getDuree().getValue());
            }

            if (d.getEcole().getVille() != null) {
                diplomaDetailedDTO.setVille(d.getEcole().getVille().getName());
            }

            if (d.getMention() != null) {
                diplomaDetailedDTO.setMentionBac(d.getMention().getMention());
            }

            // Handle collection fields
            if (d.getCareers() != null && !d.getCareers().isEmpty()) {
                List<String> careers = d.getCareers().stream()
                        .map(Career::getCareer)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                diplomaDetailedDTO.setCareer(careers);
            }

            if (d.getOpportunities() != null && !d.getOpportunities().isEmpty()) {
                List<String> opportunities = d.getOpportunities().stream()
                        .map(EmploymentOpportunity::getOppotunity)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                diplomaDetailedDTO.setEmploymentOpportunities(opportunities);
            }

            if (d.getPreviousDiploma() != null && !d.getPreviousDiploma().isEmpty()) {
                List<String> previousDiplomas = d.getPreviousDiploma().stream()
                        .map(PreviousDiploma::getAncienneDiplome) // 🔥 on récupère le nom du diplôme
                        .filter(Objects::nonNull)     // 🔥 on enlève les nulls
                        .collect(Collectors.toList());
                diplomaDetailedDTO.setAncienneDiplome(previousDiplomas);
            }

            if (d.getFiliere() != null && !d.getFiliere().isEmpty()) {
                List<String> filieres = d.getFiliere().stream()
                        .map(Filiere::getName)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                diplomaDetailedDTO.setFiliere(filieres);
            }



            if (d.getSubjects() != null && !d.getSubjects().isEmpty()) {
                List<String> diplomaSubjects = d.getSubjects().stream()
                        .map(Subject::getName)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                diplomaDetailedDTO.setMatieresDiplome(diplomaSubjects);
            }

            if (d.getRequiredStudentSubjects() != null && !d.getRequiredStudentSubjects().isEmpty()) {
                List<String> studentSubjects = d.getRequiredStudentSubjects().stream()
                        .map(EtudiantSubject::getName)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                diplomaDetailedDTO.setMatieresEtudiant(studentSubjects);
            }

            diplomaDetailedDTOS.add(diplomaDetailedDTO);
        }

        return diplomaDetailedDTOS;
    }


    @DeleteMapping("/delete/{name}")
    public ResponseEntity<String> deleteDiplomaByName(@PathVariable String name) {
        try {
            diplomaService.deleteDiplomaByName(name);
            return ResponseEntity.ok("Diploma with name " + name + " deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting diploma: " + e.getMessage());
        }
    }

    @PutMapping("/update/{nomDiplome}")
    public ResponseEntity<Diploma> updateDiploma(@PathVariable String nomDiplome, @RequestBody DiplomaUpdateDTO diplomaDTO) {

        Diploma updatedDiploma = diplomaService.updateDiploma(nomDiplome, diplomaDTO);

        return ResponseEntity.ok(updatedDiploma);
    }

    @PostMapping("/create")
    public ResponseEntity<Diploma> createDiploma(@RequestBody DiplomaUpdateDTO diplomaDTO) {

        Diploma createdDiploma = diplomaService.createDiploma(diplomaDTO);

        return ResponseEntity.ok(createdDiploma);
    }
}
