package com.example.feedbackService.Controller;

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

import com.example.feedbackService.DTO.DiplomeDTO;
import com.example.feedbackService.DTO.UserDTO;
import com.example.feedbackService.Model.Career;
import com.example.feedbackService.Model.Diplome;
import com.example.feedbackService.Model.EmploymentOpportunity;
import com.example.feedbackService.Model.Filiere;
import com.example.feedbackService.Model.MatiereDiplome;
import com.example.feedbackService.Model.MatiereEtudiant;
import com.example.feedbackService.Model.Mention;
import com.example.feedbackService.Model.QualifieForRelationship;
import com.example.feedbackService.Model.User;
import com.example.feedbackService.Service.CareerService;
import com.example.feedbackService.Service.DiplomeService;
import com.example.feedbackService.Service.EmploymentService;
import com.example.feedbackService.Service.FiliereService;
import com.example.feedbackService.Service.MatiereDiplomeService;
import com.example.feedbackService.Service.MatiereEtudService;
import com.example.feedbackService.Service.MentionService;
import com.example.feedbackService.Service.UserService;

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

    

    

    
}