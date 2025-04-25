package com.example.diplomasRecommendation.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.diplomasRecommendation.Model.MatiereDiplome;
import com.example.diplomasRecommendation.Repository.MatiereDiplomeRepo;

@Service
public class MatiereDiplomeService{
    
    @Autowired
    private MatiereDiplomeRepo matiereDiplomeRepo;

    public void save(MatiereDiplome matiereDiplome){
        matiereDiplomeRepo.save(matiereDiplome);
    }

    public MatiereDiplome findByName(String matiereDiplome){
        return matiereDiplomeRepo.findById(matiereDiplome).orElse(null);
    }
}
