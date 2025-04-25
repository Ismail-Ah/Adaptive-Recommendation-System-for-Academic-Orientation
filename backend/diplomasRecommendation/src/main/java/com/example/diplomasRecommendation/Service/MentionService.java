package com.example.diplomasRecommendation.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.diplomasRecommendation.Model.Mention;
import com.example.diplomasRecommendation.Repository.MentionRepository;

@Service
public class MentionService{
    
    @Autowired
    private MentionRepository mentionRepository;

    public void save(Mention mention){
        mentionRepository.save(mention);
    }

    public Mention findByName(String mention){
        return mentionRepository.findById(mention).orElse(null);
    }
}
