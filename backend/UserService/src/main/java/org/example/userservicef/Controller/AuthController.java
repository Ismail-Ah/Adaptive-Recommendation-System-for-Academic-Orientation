package org.example.userservicef.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.userservicef.DTO.UserDTO;
import org.example.userservicef.Security.JwtUtil;
import org.example.userservicef.Model.User;
import org.example.userservicef.Model.Interest;
import org.example.userservicef.Model.Subject;
import org.example.userservicef.Model.CareerAspiration;
import org.example.userservicef.Repository.UserRepository;
import org.example.userservicef.Repository.InterestRepository;
import org.example.userservicef.Repository.SubjectRepository;
import org.example.userservicef.Repository.CareerAspirationRepository;
import org.example.userservicef.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterestRepository interestRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private CareerAspirationRepository careerAspirationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDTO userDTO) {
        logger.info("Registering user: {}", userDTO.getEmail());

        User existingUser = userRepository.findByEmail(userDTO.getEmail());
        if (existingUser != null) {
            logger.warn("Email already registered: {}", userDTO.getEmail());
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setName(userDTO.getName());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setYear(userDTO.getYear());

        Set<Interest> interests = userDTO.getInterests().stream()
                .map(name -> interestRepository.findById(name)
                        .orElseGet(() -> interestRepository.save(new Interest(name))))
                .collect(Collectors.toSet());
        user.setInterests(interests);

        Set<Subject> subjects = userDTO.getSubjects().stream()
                .map(name -> subjectRepository.findById(name)
                        .orElseGet(() -> subjectRepository.save(new Subject(name))))
                .collect(Collectors.toSet());
        user.setSubjects(subjects);

        Set<CareerAspiration> careerAspirations = userDTO.getCareerAspirations().stream()
                .map(name -> careerAspirationRepository.findById(name)
                        .orElseGet(() -> careerAspirationRepository.save(new CareerAspiration(name))))
                .collect(Collectors.toSet());
        user.setCareerAspirations(careerAspirations);

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getEmail(),
                user.getName(),
                user.getYear(),
                interests.stream().map(Interest::getName).collect(Collectors.toSet()),
                subjects.stream().map(Subject::getName).collect(Collectors.toSet()),
                careerAspirations.stream().map(CareerAspiration::getName).collect(Collectors.toSet())
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) throws Exception {
        logger.info("Attempting login for {}", loginRequest.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        logger.info("Authentication successful");

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null) {
            logger.error("User not found after authentication: {}", loginRequest.getEmail());
            throw new Exception("User not found after authentication");
        }

        logger.info("Raw User from repository: email={}, name={}, year={}, interests={}, subjects={}, careerAspirations={}",
                user.getEmail(),
                user.getName(),
                user.getYear(),
                user.getInterests(),
                user.getSubjects(),
                user.getCareerAspirations());

        logger.info("Token generated: {}", token);
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getEmail(),
                user.getName(),
                user.getYear(),
                user.getInterests() != null ? user.getInterests().stream().map(Interest::getName).collect(Collectors.toSet()) : Collections.emptySet(),
                user.getSubjects() != null ? user.getSubjects().stream().map(Subject::getName).collect(Collectors.toSet()) : Collections.emptySet(),
                user.getCareerAspirations() != null ? user.getCareerAspirations().stream().map(CareerAspiration::getName).collect(Collectors.toSet()) : Collections.emptySet()
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserDTO updatedUserDTO, Principal principal) {
        logger.info("Updating profile for user: {}", principal != null ? principal.getName() : "null");

        if (principal == null || !principal.getName().equals(updatedUserDTO.getEmail())) {
            logger.warn("Unauthorized attempt to update profile for: {}. Principal: {}",
                    updatedUserDTO.getEmail(), principal != null ? principal.getName() : "null");
            return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN).body("Unauthorized");
        }

        User existingUser = userRepository.findByEmail(principal.getName());
        if (existingUser == null) {
            logger.error("User not found: {}", principal.getName());
            return ResponseEntity.status(HttpServletResponse.SC_NOT_FOUND).body("User not found");
        }

        existingUser.setName(updatedUserDTO.getName());
        existingUser.setYear(updatedUserDTO.getYear());

        Set<Interest> interests = updatedUserDTO.getInterests().stream()
                .map(name -> interestRepository.findById(name)
                        .orElseGet(() -> interestRepository.save(new Interest(name))))
                .collect(Collectors.toSet());
        existingUser.setInterests(interests);

        Set<Subject> subjects = updatedUserDTO.getSubjects().stream()
                .map(name -> subjectRepository.findById(name)
                        .orElseGet(() -> subjectRepository.save(new Subject(name))))
                .collect(Collectors.toSet());
        existingUser.setSubjects(subjects);

        Set<CareerAspiration> careerAspirations = updatedUserDTO.getCareerAspirations().stream()
                .map(name -> careerAspirationRepository.findById(name)
                        .orElseGet(() -> careerAspirationRepository.save(new CareerAspiration(name))))
                .collect(Collectors.toSet());
        existingUser.setCareerAspirations(careerAspirations);

        userRepository.save(existingUser);

        logger.info("Profile updated successfully for: {}", existingUser.getEmail());
        return ResponseEntity.ok(new UserResponse(
                existingUser.getEmail(),
                existingUser.getName(),
                existingUser.getYear(),
                interests.stream().map(Interest::getName).collect(Collectors.toSet()),
                subjects.stream().map(Subject::getName).collect(Collectors.toSet()),
                careerAspirations.stream().map(CareerAspiration::getName).collect(Collectors.toSet())
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        logger.info("User logged out");
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            logger.warn("No authenticated user found");
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body("Not authenticated");
        }
        logger.info("Fetching details for user: {}", principal.getName());

        User user = userRepository.findByEmail(principal.getName());
        if (user == null) {
            logger.error("Authenticated user not found in database: {}", principal.getName());
            return ResponseEntity.status(HttpServletResponse.SC_NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(new UserResponse(
                user.getEmail(),
                user.getName(),
                user.getYear(),
                user.getInterests() != null ? user.getInterests().stream().map(Interest::getName).collect(Collectors.toSet()) : Collections.emptySet(),
                user.getSubjects() != null ? user.getSubjects().stream().map(Subject::getName).collect(Collectors.toSet()) : Collections.emptySet(),
                user.getCareerAspirations() != null ? user.getCareerAspirations().stream().map(CareerAspiration::getName).collect(Collectors.toSet()) : Collections.emptySet()
        ));
    }
}

record AuthResponse(
        String token,
        String id,
        String email,
        String name,
        String year,
        Set<String> interests,
        Set<String> subjects,
        Set<String> careerAspirations
) {}

record UserResponse(
        String email,
        String name,
        String year,
        Set<String> interests,
        Set<String> subjects,
        Set<String> careerAspirations
) {}