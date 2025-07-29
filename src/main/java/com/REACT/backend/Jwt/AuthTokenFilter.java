package com.REACT.backend.Jwt;

import com.REACT.backend.users.AppUser;
import com.REACT.backend.users.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        if (path.startsWith("/ws-location")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = jwtUtils.getJwtFromHeader(request);
            log.debug("Token received from header: {}", jwt);

            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String userEmail = jwtUtils.getEmailFromJwtToken(jwt);
                log.debug("Decoded user email from token: {}", userEmail);

                AppUser userDetails = userRepository.findByUserEmail(userEmail);

                if (userDetails != null) {
                    log.debug("User found in DB: {}", userDetails.getUserEmail());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    // After (preferred based on your current structure)
                                    List.of(new SimpleGrantedAuthority(userDetails.getRole().name()))

                            );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("Security context updated with user: {}", userDetails.getUserEmail());
                }
                else {
                    log.warn("User not found in DB for email: {}", userEmail);
                }
            }
            else {
                log.warn("Invalid or missing JWT token.");
            }

        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }


}
