package org.example.userservicef.DTO;

import lombok.Data;
import org.example.userservicef.Model.User;
import org.example.userservicef.Model.Subject;
import org.example.userservicef.Model.CareerAspiration;

import java.util.Set;

@Data
public class UserWithRelationships {
    private User user;
    private Set<Subject> subjects;
    private Set<CareerAspiration> careerAspirations;
}