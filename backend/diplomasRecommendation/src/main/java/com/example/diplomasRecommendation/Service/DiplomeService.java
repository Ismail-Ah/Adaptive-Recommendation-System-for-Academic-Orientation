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

    public Diplome findById(String diplome){
        return diplomeRepository.findById(diplome).orElse(null);
    }
}
