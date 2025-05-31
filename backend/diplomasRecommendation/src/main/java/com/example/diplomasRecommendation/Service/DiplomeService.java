package com.example.diplomasRecommendation.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.diplomasRecommendation.Model.Diplome;
import com.example.diplomasRecommendation.Repository.DiplomeRepository;

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

    public boolean hasFeedbackRelationships(Diplome diplome) {
        return diplomeRepository.countFeedbackRelationships(diplome.getId()) > 0;
    }

    public void delete(Diplome diplome) {
        // Only delete if there are no feedback relationships
        if (!hasFeedbackRelationships(diplome)) {
            diplomeRepository.delete(diplome);
        }
        // If there are feedback relationships, we keep the diploma for historical purposes
    }

    public Diplome findById(String diplome){
        return diplomeRepository.findById(diplome).orElse(null);
    }
}
