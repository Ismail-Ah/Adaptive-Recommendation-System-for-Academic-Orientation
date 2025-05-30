package com.example.feedbackService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.feedbackService.Model.Filiere;
import com.example.feedbackService.Repository.FiliereRepository;

@Service
public class FiliereService{
    
    @Autowired
    private FiliereRepository filiereRepository;

    public void save(Filiere filiere){
        filiereRepository.save(filiere);
    }

    public Filiere findByName(String filiere){
        return filiereRepository.findById(filiere).orElse(null);
    }
}
