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
import java.util.List;
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
                interests.stream().map(Interest::getName).collect(Collectors.toList()),
                subjects.stream().map(Subject::getName).collect(Collectors.toList()),
                careerAspirations.stream().map(CareerAspiration::getName).collect(Collectors.toList())
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserDTO updatedUserDTO, Principal principal) {
        logger.info("Updating profile for user: {}", principal.getName());

        if (principal == null || !principal.getName().equals(updatedUserDTO.getEmail())) {
            logger.warn("Unauthorized attempt to update profile for: {}", updatedUserDTO.getEmail());
            return ResponseEntity.status(HttpServletResponse.SC_FORBIDDEN).body("Unauthorized");
        }

        User existingUser = userRepository.findUserWithRelationships(principal.getName());
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
                interests.stream().map(Interest::getName).collect(Collectors.toList()),
                subjects.stream().map(Subject::getName).collect(Collectors.toList()),
                careerAspirations.stream().map(CareerAspiration::getName).collect(Collectors.toList())
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) throws Exception {
        logger.info("Attempting login for {}", loginRequest.getEmail());

        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        logger.info("Authentication successful");

        // Load user details and generate token
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        logger.info("User details loaded for {}", userDetails.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        // Fetch user with relationships
        User user = userRepository.findUserWithRelationships(loginRequest.getEmail());
        if (user == null) {
            logger.error("User not found after authentication: {}", loginRequest.getEmail());
            throw new Exception("User not found after authentication");
        }

        logger.info("Token generated: {}", token);
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(), // id = email
                user.getEmail(),
                user.getName(),
                user.getYear(),
                user.getInterests().stream().map(Interest::getName).collect(Collectors.toList()),
                user.getSubjects().stream().map(Subject::getName).collect(Collectors.toList()),
                user.getCareerAspirations().stream().map(CareerAspiration::getName).collect(Collectors.toList())
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

        User user = userRepository.findUserWithRelationships(principal.getName());
        if (user == null) {
            logger.error("Authenticated user not found in database: {}", principal.getName());
            return ResponseEntity.status(HttpServletResponse.SC_NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(new UserResponse(
                user.getEmail(),
                user.getName(),
                user.getYear(),
                user.getInterests().stream().map(Interest::getName).collect(Collectors.toList()),
                user.getSubjects().stream().map(Subject::getName).collect(Collectors.toList()),
                user.getCareerAspirations().stream().map(CareerAspiration::getName).collect(Collectors.toList())
        ));
    }
}

// Records with id for frontend compatibility
record AuthResponse(
        String token,
        String id, // Included for frontend compatibility, set to email
        String email,
        String name,
        String year,
        List<String> interests,
        List<String> subjects,
        List<String> careerAspirations
) {}

record UserResponse(
        String email,
        String name,
        String year,
        List<String> interests,
        List<String> subjects,
        List<String> careerAspirations
) {}