package org.example.userservicef.Controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.userservicef.DTO.UserDTO;
import org.example.userservicef.Model.*;
import org.example.userservicef.Repository.*;
import org.example.userservicef.Security.JwtUtil;
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
import java.util.ArrayList;
import java.util.Collections;
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
    private SubjectRepository subjectRepository;

    @Autowired
    private CareerAspirationRepository careerAspirationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private YearRepository yearRepository;

    @Autowired
    private FiliereRepository filiereRepository;

    @Autowired
    private DureeRepository dureeRepository;

    @Autowired
    private MontionBacRepository montionBacRepository;

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

        // Handle Year relationship
        Year year = yearRepository.findByName(userDTO.getYear());
        if (year == null) {
            year = new Year(userDTO.getYear());
            yearRepository.save(year);
        }
        user.setYear(year);

        // Handle Filiere relationship
        Filiere filiere = filiereRepository.findByName(userDTO.getFiliere());
        if (filiere == null) {
            filiere = new Filiere(userDTO.getFiliere());
            filiereRepository.save(filiere);
        }
        user.setFiliere(filiere);

        Duree duree = dureeRepository.findByName(userDTO.getDuree());
        if (duree == null) {
            duree = new Duree(userDTO.getDuree());
            dureeRepository.save(duree);
        }
        user.setDuree(duree);

        MontionBac montionBac = montionBacRepository.findByName(userDTO.getMontionBac());
        if (montionBac == null) {
            montionBac = new MontionBac(userDTO.getMontionBac());
            montionBacRepository.save(montionBac);
        }
        user.setMontionBac(montionBac);
        

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
                user.getYear().getName(), // Return year name
                user.getFiliere().getName(), // Return filiere name
                user.getDuree().getName(), 
                user.getMontionBac().getName(), 
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

        logger.info("Raw User from repository: email={}, name={}, year={}, filiere={}, interests={}, subjects={}, careerAspirations={}",
                user.getEmail(),
                user.getName(),
                user.getYear() != null ? user.getYear().getName() : "null",
                user.getFiliere() != null ? user.getFiliere().getName() : "null",
                user.getDuree() != null ? user.getDuree().getName() : null,
                user.getMontionBac() != null ? user.getMontionBac().getName() : "null",
                
                user.getSubjects(),
                user.getCareerAspirations());

        logger.info("Token generated: {}", token);
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getEmail(),
                user.getName(),
                user.getYear() != null ? user.getYear().getName() : "null", // Return year name
                user.getFiliere() != null ? user.getFiliere().getName() : "null", // Return filiere name
                user.getDuree() != null ? user.getDuree().getName() : null, // Return filiere name
                user.getMontionBac() != null ? user.getMontionBac().getName() : "null", // Return filiere name
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
    
        // ✅ Step 1: Remove all existing relationships
        userDetailsService.deleteUserRelationships(existingUser.getEmail());
    
        // ✅ Step 2: Assign new relationships
        Year year = yearRepository.findByName(updatedUserDTO.getYear());
        if (year == null) {
            year = new Year(updatedUserDTO.getYear());
            yearRepository.save(year);
        }
        existingUser.setYear(year);
    
        Filiere filiere = filiereRepository.findByName(updatedUserDTO.getFiliere());
        if (filiere == null) {
            filiere = new Filiere(updatedUserDTO.getFiliere());
            filiereRepository.save(filiere);
        }
        existingUser.setFiliere(filiere);
    
        Duree duree = dureeRepository.findByName(updatedUserDTO.getDuree());
        if (duree == null) {
            duree = new Duree(updatedUserDTO.getDuree());
            dureeRepository.save(duree);
        }
        existingUser.setDuree(duree);
    
        MontionBac montionBac = montionBacRepository.findByName(updatedUserDTO.getMontionBac());
        if (montionBac == null) {
            montionBac = new MontionBac(updatedUserDTO.getMontionBac());
            montionBacRepository.save(montionBac);
        }
        existingUser.setMontionBac(montionBac);
    
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
                existingUser.getYear().getName(),
                existingUser.getFiliere().getName(),
                existingUser.getDuree().getName(),
                existingUser.getMontionBac().getName(),
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
                user.getYear() != null ? user.getYear().getName() : "null", // Return year name
                user.getFiliere() != null ? user.getFiliere().getName() : "null", // Return filiere name
                user.getDuree() != null ? user.getDuree().getName() : null, // Return filiere name
                user.getMontionBac() != null ? user.getMontionBac().getName() : "null", // Return filiere name
                user.getSubjects() != null ? user.getSubjects().stream().map(Subject::getName).collect(Collectors.toSet()) : Collections.emptySet(),
                user.getCareerAspirations() != null ? user.getCareerAspirations().stream().map(CareerAspiration::getName).collect(Collectors.toSet()) : Collections.emptySet()
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(Principal principal) {
        if (principal == null) {
            logger.warn("No authenticated user found");
            return null;
        }

        logger.info("Fetching details for user: {}", principal.getName());

        User user = userRepository.findByEmail(principal.getName());
        if (user == null) {
            logger.error("Authenticated user not found in database: {}", principal.getName());
            return null;
        }

        if (!user.getRole().equals("ADMIN")) {
            logger.error("Unauthorized!", principal.getName());
            return null;
        }

        List<User> users = userRepository.findAll();
        List<UserDTO> usersDTO = new ArrayList<>();
        for(User u : users){
            UserDTO userDTO = new UserDTO();
            userDTO.setEmail(u.getEmail());
            userDTO.setDuree( user.getDuree() != null ? user.getDuree().getName() : null);
            userDTO.setFiliere(user.getFiliere() != null ? user.getFiliere().getName() : "null");
            userDTO.setMontionBac(user.getMontionBac() != null ? user.getMontionBac().getName() : "null");
            userDTO.setSubjects(user.getSubjects() != null ? user.getSubjects().stream().map(Subject::getName).collect(Collectors.toSet()) : Collections.emptySet());
            userDTO.setCareerAspirations(user.getCareerAspirations() != null ? user.getCareerAspirations().stream().map(CareerAspiration::getName).collect(Collectors.toSet()) : Collections.emptySet());
            usersDTO.add(userDTO);
        }

        return ResponseEntity.ok(usersDTO);
    }
}

record AuthResponse(
        String token,
        String id,
        String email,
        String name,
        String year, 
        String filiere,
        int duree,
        String montionBac,
        Set<String> subjects,
        Set<String> careerAspirations
) {}

record UserResponse(
        String email,
        String name,
        String year, 
        String filiere, 
        int duree,
        String montionBac,
        Set<String> subjects,
        Set<String> careerAspirations
) {}