package com.example.diplomasRecommendation.DTO;

import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private String email;
    private String Role;
    private String filiere; 
    private Set<String> subjects;
    private Set<String> careerAspirations;
    private String montionBac;
    private int duree;
}