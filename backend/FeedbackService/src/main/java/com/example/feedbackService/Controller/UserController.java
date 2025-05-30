package com.example.feedbackService.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.feedbackService.DTO.UserDTO;
import com.example.feedbackService.DTO.UsersDTO;
import com.example.feedbackService.Service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired RestTemplate restTemplate;

    private HttpEntity<String> getEntity(HttpServletRequest request){
        // Extract Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        // Set up headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        return new HttpEntity<>(null, headers);
    }
    
    public UserDTO getUser(HttpServletRequest request) {
        
        HttpEntity<String> entity = getEntity(request);

        UserDTO user = restTemplate.exchange(
                "http://user-service/api/auth/me", 
                HttpMethod.GET,
                entity,
                UserDTO.class
        ).getBody();

        return user;
    }

    public List<UserDTO> getAllUsers(HttpServletRequest request){
        HttpEntity<String> entity = getEntity(request); 

        List<UserDTO> users =(List<UserDTO>) restTemplate.exchange(
                "http://user-service/api/auth/users", 
                HttpMethod.GET,
                entity,
                UsersDTO.class
        ).getBody();

        return users;
    }

}
