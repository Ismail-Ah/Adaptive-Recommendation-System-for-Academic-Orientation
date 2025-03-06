package org.example.userservicef.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final long JWT_TOKEN_VALIDITY = 5 * 60 * 60; // 5 hours

    @Value("${jwt.secret}") // Load the secret key from application.properties or environment variables
    private String secret;

    // Generate a secure 512-bit key from the secret
    private SecretKey getSecretKey() {
        byte[] decodedKey = Base64.getDecoder().decode(secret); // Decode the base64-encoded secret
        return Keys.hmacShaKeyFor(decodedKey); // Create a secure key
    }

    public String generateToken(UserDetails userDetails) {
        System.out.println("JwtUtil: Generating token for " + userDetails.getUsername());
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
                .signWith(getSecretKey(), SignatureAlgorithm.HS512) // Use the secure key
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSecretKey()) // Use the secure key
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        System.out.println("JwtUtil: Validating token for " + (userDetails != null ? userDetails.getUsername() : "null"));
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSecretKey()) // Use the secure key
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            String username = claims.getSubject();
            return username.equals(userDetails.getUsername()) && !isTokenExpired(claims);
        } catch (Exception e) {
            System.err.println("JwtUtil: Token validation failed: " + e.getMessage());
            return false;
        }
    }

    private Boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }
}