package org.example.userservicef.config;

import org.example.userservicef.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        System.out.println("JwtFilter: Processing request for " + request.getRequestURI());
        String authorizationHeader = request.getHeader("Authorization");

        String token = null;
        String username = null;

        // Only process token for protected endpoints, skip for /api/auth/login
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ") &&
                !request.getRequestURI().equals("/api/auth/login")) {
            token = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(token);
                System.out.println("JwtFilter: Extracted username: " + username);
            } catch (Exception e) {
                System.err.println("JwtFilter: Invalid JWT token: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("JwtFilter: Loading user details for " + username);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (userDetails != null && jwtUtil.validateToken(token, userDetails)) {
                System.out.println("JwtFilter: Token validated, setting authentication");
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            } else {
                System.out.println("JwtFilter: Token validation failed or userDetails null");
            }
        }
        chain.doFilter(request, response);
    }
}