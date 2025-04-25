package org.example.userservicef.Service;

import org.example.userservicef.Model.User;
import org.example.userservicef.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService implements UserDetailsService {

    private final Neo4jClient neo4jClient;

    public UserService(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // Add roles/authorities if needed
        );
    }


    public void deleteUserRelationships(String email) {
        String cypherQuery = """
            MATCH (u:User {email: $email})-[r]->(n)
            DELETE r
            WITH n
            WHERE NOT (n)-[]-()
            DELETE n;
        """;
    
        neo4jClient.query(cypherQuery)
                   .bind(email).to("email")
                   .run();
    }
    
}