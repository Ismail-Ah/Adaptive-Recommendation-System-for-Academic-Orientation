package com.example.feedbackService.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.data.neo4j.core.DatabaseSelection;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;

import com.example.feedbackService.Model.Diplome;
import com.example.feedbackService.Model.Feedback;
import com.example.feedbackService.Model.User;
import com.example.feedbackService.Model.QualifieForRelationship;
import com.example.feedbackService.Repository.DiplomeRepository;
import com.example.feedbackService.Repository.UserRepository;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DiplomeRepository diplomRepository;
    @Autowired
    private Neo4jTemplate neo4jTemplate;

    public void save(User user) {
        logger.info("Saving user: {}", user);
        userRepository.save(user);
        logger.info("User saved successfully in userdiplomas database");
    }

    public User findByEmail(String email) {
        logger.info("Searching for user with email: {}", email);
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("No user found with email: " + email));
    }

    public List<User> getAllUsers() {
        logger.info("Fetching all users");
        List<User> users = userRepository.findAll();
        logger.info("Found {} users", users.size());
        return users;
    }

    public void updateFeedBack(String email, String name, boolean like, List<String> notes, float rate) {
        logger.info("Updating feedback for user: {} and diploma: {}", email, name);
        User user = findByEmail(email);
        Diplome diplome = diplomRepository.findByName(name);
        if (diplome == null) {
            throw new RuntimeException("Diploma with name '" + name + "' not found");
        }

        // Get the match percentage from QUALIFIE_FOR relationship
        Integer matchPercentage = user.getDiplomeRelationships().stream()
            .filter(rel -> rel.getDiplome().getName().equals(name))
            .findFirst()
            .map(rel -> (int) Math.round(rel.getMatchPercentage()))
            .orElse(null);

        // Check if feedback already exists for this diploma
        Optional<Feedback> existingFeedback = user.getFeedbacks().stream()
            .filter(f -> f.getDiplome().getName().equals(name))
            .findFirst();

        if (existingFeedback.isPresent()) {
            // Update existing feedback
            Feedback feedback = existingFeedback.get();
            feedback.setLike(like);
            feedback.setNotes(notes);
            feedback.setRating(rate);
            feedback.setMatchPercentage(matchPercentage);
            logger.info("Updated existing feedback for diploma: {}", name);
        } else {
            // Create new feedback
            Feedback feedback = new Feedback(like, notes, rate, matchPercentage, diplome);
            user.getFeedbacks().add(feedback);
            logger.info("Created new feedback for diploma: {}", name);
        }

        userRepository.save(user);
        logger.info("Feedback updated successfully");
    }

    public List<Feedback> getFeedbacks(String email) {
        logger.info("Getting feedbacks for user: {}", email);
        User user = findByEmail(email);
        
        // Update match percentages in feedbacks from QUALIFIE_FOR relationships
        for (Feedback feedback : user.getFeedbacks()) {
            String diplomeName = feedback.getDiplome().getName();
            Integer matchPercentage = user.getDiplomeRelationships().stream()
                .filter(rel -> rel.getDiplome().getName().equals(diplomeName))
                .findFirst()
                .map(rel -> (int) Math.round(rel.getMatchPercentage()))
                .orElse(null);
            feedback.setMatchPercentage(matchPercentage);
        }
        
        return user.getFeedbacks();
    }

    public Feedback getFeedbackForDiploma(String email, String diplomeName) {
        logger.info("Getting feedback for user: {} and diploma: {}", email, diplomeName);
        User user = findByEmail(email);
        Feedback feedback = user.getFeedbacks().stream()
            .filter(f -> f.getDiplome().getName().equals(diplomeName))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No feedback found for the specified diploma"));
            
        // Update match percentage from QUALIFIE_FOR relationship
        Integer matchPercentage = user.getDiplomeRelationships().stream()
            .filter(rel -> rel.getDiplome().getName().equals(diplomeName))
            .findFirst()
            .map(rel -> (int) Math.round(rel.getMatchPercentage()))
            .orElse(null);
        feedback.setMatchPercentage(matchPercentage);
        
        return feedback;
    }

    public void deleteFeedback(String email, String diplomeName) {
        logger.info("Deleting feedback for user: {} and diploma: {}", email, diplomeName);
        User user = findByEmail(email);
        
        // Find the feedback to delete
        Optional<Feedback> feedbackToDelete = user.getFeedbacks().stream()
            .filter(feedback -> feedback.getDiplome().getName().equals(diplomeName))
            .findFirst();
            
        if (feedbackToDelete.isPresent()) {
            Feedback feedback = feedbackToDelete.get();
            
            // Delete the relationship using repository method
            userRepository.deleteFeedbackRelationship(email, diplomeName);
                
            // Remove from the user's feedback list
            user.getFeedbacks().remove(feedback);
            userRepository.save(user);
            
            logger.info("Successfully deleted HAS_FEEDBACK relationship and feedback for user: {} and diploma: {}", 
                       email, diplomeName);
        } else {
            logger.warn("No feedback found to delete for user: {} and diploma: {}", email, diplomeName);
        }
    }

    public List<Diplome> getLikedDiplomas(String email) {
        logger.info("Getting liked diplomas for user: {}", email);
        User user = findByEmail(email);
        return user.getFeedbacks().stream()
            .filter(Feedback::isLike)
            .map(Feedback::getDiplome)
            .collect(Collectors.toList());
    }

    public List<Diplome> getRatedDiplomas(String email) {
        logger.info("Getting rated diplomas for user: {}", email);
        User user = findByEmail(email);
        return user.getFeedbacks().stream()
            .filter(feedback -> feedback.getRating() > 0)
            .map(Feedback::getDiplome)
            .collect(Collectors.toList());
    }
}