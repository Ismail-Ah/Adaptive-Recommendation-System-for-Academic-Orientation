package com.example.feedbackService.Mapper;

import com.example.feedbackService.DTO.DiplomeRecommendDTO;
import com.example.feedbackService.Model.Diplome;
import com.example.feedbackService.Model.Feedback;
import com.example.feedbackService.Model.Filiere;
import com.example.feedbackService.Model.MatiereEtudiant;
import com.example.feedbackService.Model.MatiereDiplome;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class DiplomeMapper {
    
    public DiplomeRecommendDTO toRecommendDTO(Diplome diplome) {
        DiplomeRecommendDTO dto = new DiplomeRecommendDTO();
        dto.setNom_Diplôme(diplome.getName());
        dto.setVille(diplome.getVille());
        dto.setEcole(diplome.getEcole());
        dto.setDurée(diplome.getDuration());
        
        // Map relationships
        if (diplome.getMention() != null) {
            dto.setMention_Bac(diplome.getMention().getMention());
        }
        
        // Map sets
        dto.setAncienne_Diplome(diplome.getDiplomes().stream()
            .map(Diplome::getDuration)
            .collect(Collectors.toSet()));
            
        dto.setEmployement_Opportunities(diplome.getOpportunities().stream()
            .map(o -> o.getOppotunity())
            .collect(Collectors.toSet()));
            
        dto.setCareer(diplome.getCareers().stream()
            .map(c -> c.getCareer())
            .collect(Collectors.toSet()));
            
        dto.setFiliere(diplome.getFilieres().stream()
            .map(Filiere::getFiliere)
            .collect(Collectors.toSet()));
            
        dto.setMatieres_Etudiant(diplome.getMatiereEtudiants().stream()
            .map(MatiereEtudiant::getMatiere)
            .collect(Collectors.toSet()));
            
        dto.setMatieres_Diplome(diplome.getMatiereDiplomes().stream()
            .map(MatiereDiplome::getMatiere)
            .collect(Collectors.toSet()));
            
        return dto;
    }
    
    public DiplomeRecommendDTO toRecommendDTOWithFeedback(Diplome diplome, Feedback feedback) {
        DiplomeRecommendDTO dto = toRecommendDTO(diplome);
        if (feedback != null) {
            dto.setNotes(feedback.getNotes());
            dto.setRating(feedback.getRating());
            dto.setLike(feedback.isLike());
            dto.setMatch_percentage(feedback.getMatchPercentage());
        }
        return dto;
    }
    
    public List<DiplomeRecommendDTO> toRecommendDTOList(List<Diplome> diplomes) {
        return diplomes.stream()
            .map(this::toRecommendDTO)
            .collect(Collectors.toList());
    }
} 