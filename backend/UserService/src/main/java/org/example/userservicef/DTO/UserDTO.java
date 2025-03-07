package org.example.userservicef.DTO;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private String email;
    private String name;
    private String password;
    private String year;
    private List<String> interests;
    private List<String> subjects;
    private List<String> careerAspirations;
}