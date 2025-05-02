package org.example.userservicef.DTO;

import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private String email;
    private String name;
    private String password;
    private String year; 
    private String filiere;
    private Set<String> subjects;
    private Set<String> careerAspirations;
    private String montionBac;
    private int duree;
}