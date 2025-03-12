package org.example.userservicef.Repository;

import lombok.Data;
import org.example.userservicef.Model.User;
import org.example.userservicef.Model.Interest;
import org.example.userservicef.Model.Subject;
import org.example.userservicef.Model.CareerAspiration;

import java.util.Set;

@Data
public class UserWithRelationships {
    private User user;
    private Set<Interest> interests;
    private Set<Subject> subjects;
    private Set<CareerAspiration> careerAspirations;
}