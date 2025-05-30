package com.example.feedbackService.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.feedbackService.Model.MatiereEtudiant;
import com.example.feedbackService.Repository.MatiereEtudRepo;

@Service
public class MatiereEtudService{
    
    @Autowired
    private MatiereEtudRepo matiereEtudRepo;

    public void save(MatiereEtudiant matiereEtud){
        matiereEtudRepo.save(matiereEtud);
    }

    public MatiereEtudiant findByName(String matiereEtud){
        return matiereEtudRepo.findById(matiereEtud).orElse(null);
    }
}
