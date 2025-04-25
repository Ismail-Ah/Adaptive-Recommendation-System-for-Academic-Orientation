package com.example.updateService.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping
public class UpdateController {

    @Autowired 
    RestTemplate restTemplate;

    @GetMapping("/user/update-diplomas")
    public void userUpdatedDiplomas(HttpServletRequest request){
       
        HttpEntity<String> entity = getEntity(request);

        restTemplate.exchange(
                "http://userdiplomas/api/recommend-gnn", 
                HttpMethod.GET,
                entity,
                void.class
        ).getBody();
    }

    @PostMapping("/users/update-diplomas")
    public void usersUpdateDiplomas(HttpServletRequest request){
        HttpEntity<String> entity = getEntity(request);
        restTemplate.exchange(
                "http://userdiplomas/api/recommend-gnn-all", 
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
