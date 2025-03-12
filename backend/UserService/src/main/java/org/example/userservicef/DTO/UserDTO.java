package org.example.userservicef.DTO;

import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private String email;
    private String name;
    private String password; // Only used in signup
    private String year;
    private Set<String> interests;         // Changed to Set<String>
    private Set<String> subjects;          // Changed to Set<String>
    private Set<String> careerAspirations; // Changed to Set<String>
}