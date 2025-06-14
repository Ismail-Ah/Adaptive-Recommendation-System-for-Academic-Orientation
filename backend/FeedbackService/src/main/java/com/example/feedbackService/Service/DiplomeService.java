package com.example.feedbackService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.feedbackService.Model.Diplome;
import com.example.feedbackService.Repository.DiplomeRepository;

@Service
public class DiplomeService{
    
    @Autowired
    private DiplomeRepository diplomeRepository;

    public void save(Diplome diplome){
        diplomeRepository.save(diplome);
    }

    public Diplome findByName(String name) {
        return diplomeRepository.findByName(name);
    }
    public void delete(Diplome diplome) {
        diplomeRepository.delete(diplome); // Assuming repository is a Neo4j repository
    }

    public Diplome findById(String diplome){
        return diplomeRepository.findById(diplome).orElse(null);
    }
}
