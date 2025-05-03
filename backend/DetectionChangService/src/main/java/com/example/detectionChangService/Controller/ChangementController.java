package com.example.detectionChangService.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:5173")
public class ChangementController {

    @Autowired 
    RestTemplate restTemplate;

    @GetMapping("/profile-updated")
    public void userUpdatedDiplomas(HttpServletRequest request){
       
        HttpEntity<String> entity = getEntity(request);

        restTemplate.exchange(
                "http://update-service/api/user/update-diplomas", 
                HttpMethod.GET,
                entity,
                void.class
        ).getBody();
    }

    @GetMapping("/diplomas-updated")
    public void usersUpdateDiplomas(HttpServletRequest request){
        HttpEntity<String> entity = getEntity(request);
        restTemplate.exchange(
                "http://update-service/api/users/update-diplomas", 
                HttpMethod.GET,
                entity,
                void.class
        ).getBody();
    }

    private HttpEntity<String> getEntity(HttpServletRequest request){
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        // Set up headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        HttpEntity<String> entity = new HttpEntity<>(null, headers);
        return entity;
    }


}
