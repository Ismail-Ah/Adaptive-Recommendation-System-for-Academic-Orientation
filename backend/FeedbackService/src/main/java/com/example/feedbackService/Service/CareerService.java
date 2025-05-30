package com.example.feedbackService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.feedbackService.Model.Career;
import com.example.feedbackService.Repository.CareerRepository;

@Service
public class CareerService{
    
    @Autowired
    private CareerRepository careerRepository;

    public void save(Career career){
        careerRepository.save(career);
    }

    public Career findByName(String career){
        return careerRepository.findById(career).orElse(null);
    }
}
