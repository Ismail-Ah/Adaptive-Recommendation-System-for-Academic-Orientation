package com.example.diplomasRecommendation.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.diplomasRecommendation.Model.User;
import com.example.diplomasRecommendation.Repository.UserRepository;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class); // Fixed logger

    @Autowired
    private UserRepository userRepository;

    public void save(User user) {
        logger.info("Saving user: {}", user);
        userRepository.save(user);
        logger.info("User saved successfully in userdiplomas database");
    }

    public User findByEmail(String email) {
        logger.info("Searching for user with email: {}", email);
        Optional<User> userOptional = userRepository.findByEmail(email);
        logger.info("Raw Optional<User> result: isPresent={}, value={}", 
            userOptional.isPresent(), userOptional.orElse(null));
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            logger.info("User found in userdiplomas database: {}", user);
            return user;
        } else {
            logger.info("No user found with email: {} in userdiplomas database", email);
            return null;
        }
    }

    public List<User> getAllUsers() {
        logger.info("Fetching all users");
        List<User> users = userRepository.findAll();
        logger.info("Found {} users", users.size());
        return users;
    }
}