package com.example.diplomasRecommendation.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.diplomasRecommendation.Model.EmploymentOpportunity;
import com.example.diplomasRecommendation.Repository.EmploymentRepository;

@Service
public class EmploymentService{
    
    @Autowired
    private EmploymentRepository employmentRepository;

    public void save(EmploymentOpportunity employment){
        employmentRepository.save(employment);
    }

    public EmploymentOpportunity findByName(String employment){
        return employmentRepository.findById(employment).orElse(null);
    }
}
