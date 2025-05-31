package com.example.feedbackService.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.feedbackService.DTO.FeedbackDTO;
import com.example.feedbackService.DTO.EmailDTO;
import com.example.feedbackService.DTO.DiplomeRecommendDTO;
import com.example.feedbackService.Service.UserService;
import com.example.feedbackService.Model.Feedback;
import com.example.feedbackService.Model.Diplome;
import com.example.feedbackService.Mapper.DiplomeMapper;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private UserService userService;
    
    @Autowired
    private DiplomeMapper diplomeMapper;

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        logger.error("Error processing request", e);
        return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
    }

    @PostMapping("/update-feedback")
    public ResponseEntity<?> updateFeedback(@Valid @RequestBody FeedbackDTO feedback) {
        try {
            logger.info("Received feedback update request: {}", feedback);
            logger.info("Email: {}", feedback.getEmail());
            logger.info("DiplomeName: {}", feedback.getDiplomeName());
            logger.info("Like: {}", feedback.getLike());
            logger.info("Rating: {}", feedback.getRating());
            logger.info("Notes: {}", feedback.getNotes());
            
            if (feedback.getDiplomeName() == null || feedback.getDiplomeName().trim().isEmpty()) {
                logger.error("Diploma name is null or empty");
                return ResponseEntity.badRequest().body("Diploma name cannot be null or empty");
            }
            
            userService.updateFeedBack(feedback.getEmail(), feedback.getDiplomeName(), feedback.getLike(), feedback.getNotes(), feedback.getRating());
            List<Feedback> feedbacks = userService.getFeedbacks(feedback.getEmail());
            List<DiplomeRecommendDTO> dtoList = feedbacks.stream()
                .map(f -> diplomeMapper.toRecommendDTOWithFeedback(f.getDiplome(), f))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            logger.error("Error during updating feedback", e);
            return ResponseEntity.status(400).body("Error during updating feedback: " + e.getMessage());
        }
    }

    @PostMapping("/get-feedback")
    public ResponseEntity<?> getFeedback(@Valid @RequestBody EmailDTO emailDTO) {
        try {
            logger.info("Fetching feedbacks for email: {}", emailDTO.getEmail());
            if (emailDTO.getEmail() == null || emailDTO.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email cannot be null or empty");
            }
            List<Feedback> feedbacks = userService.getFeedbacks(emailDTO.getEmail());
            List<DiplomeRecommendDTO> dtoList = feedbacks.stream()
                .map(f -> diplomeMapper.toRecommendDTOWithFeedback(f.getDiplome(), f))
                .collect(java.util.stream.Collectors.toList());
            logger.info("Found {} feedbacks for email: {}", dtoList.size(), emailDTO.getEmail());
            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            logger.error("Error during fetching feedbacks", e);
            return ResponseEntity.status(400).body("Error during fetching feedbacks: " + e.getMessage());
        }
    }

    @GetMapping("/feedback/{email}/{diplomeName}")
    public ResponseEntity<?> getFeedbackForDiploma(
            @PathVariable String email,
            @PathVariable String diplomeName) {
        try {
            logger.info("Fetching feedback for email: {} and diploma: {}", email, diplomeName);
            if (email == null || email.trim().isEmpty() || diplomeName == null || diplomeName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email and diploma name cannot be null or empty");
            }
            Feedback feedback = userService.getFeedbackForDiploma(email, diplomeName);
            DiplomeRecommendDTO dto = diplomeMapper.toRecommendDTOWithFeedback(feedback.getDiplome(), feedback);
            logger.info("Found feedback for email: {} and diploma: {}", email, diplomeName);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            logger.error("Error fetching feedback for diploma", e);
            return ResponseEntity.status(400).body("Error fetching feedback for diploma: " + e.getMessage());
        }
    }

    @DeleteMapping("/feedback/{email}/{diplomeName}")
    public ResponseEntity<?> deleteFeedback(
            @PathVariable String email,
            @PathVariable String diplomeName) {
        try {
            logger.info("Deleting feedback for email: {} and diploma: {}", email, diplomeName);
            if (email == null || email.trim().isEmpty() || diplomeName == null || diplomeName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email and diploma name cannot be null or empty");
            }
            userService.deleteFeedback(email, diplomeName);
            logger.info("Successfully deleted feedback for email: {} and diploma: {}", email, diplomeName);
            return ResponseEntity.ok("Feedback deleted successfully");
        } catch (Exception e) {
            logger.error("Error deleting feedback", e);
            return ResponseEntity.status(400).body("Error deleting feedback: " + e.getMessage());
        }
    }

    @GetMapping("/feedback/liked/{email}")
    public ResponseEntity<?> getLikedDiplomas(@PathVariable String email) {
        try {
            logger.info("Fetching liked diplomas for email: {}", email);
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email cannot be null or empty");
            }
            List<Diplome> likedDiplomas = userService.getLikedDiplomas(email);
            List<DiplomeRecommendDTO> dtoList = diplomeMapper.toRecommendDTOList(likedDiplomas);
            logger.info("Found {} liked diplomas for email: {}", dtoList.size(), email);
            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            logger.error("Error fetching liked diplomas", e);
            return ResponseEntity.status(400).body("Error fetching liked diplomas: " + e.getMessage());
        }
    }

    @GetMapping("/feedback/rated/{email}")
    public ResponseEntity<?> getRatedDiplomas(@PathVariable String email) {
        try {
            logger.info("Fetching rated diplomas for email: {}", email);
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email cannot be null or empty");
            }
            List<Diplome> ratedDiplomas = userService.getRatedDiplomas(email);
            List<DiplomeRecommendDTO> dtoList = diplomeMapper.toRecommendDTOList(ratedDiplomas);
            logger.info("Found {} rated diplomas for email: {}", dtoList.size(), email);
            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            logger.error("Error fetching rated diplomas", e);
            return ResponseEntity.status(400).body("Error fetching rated diplomas: " + e.getMessage());
        }
    }
}