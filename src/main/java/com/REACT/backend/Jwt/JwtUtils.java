package com.REACT.backend.Jwt;

import com.REACT.backend.users.AppUser;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Slf4j
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Component
public class JwtUtils {

    @Value("${spring.app.jwtSecret}")
    private String jwtSecret;

    @Value("${spring.app.jwtExpirationMs}")
    private long jwtExpirationMs;

    private Key key() {
        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        log.debug("Signing key generated from jwtSecret");
        return key;
    }


    public String getJwtFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        log.info("Authorization Header: {}", bearerToken);

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            log.info("Extracted JWT token: {}", token);
            return token;
        }

        log.warn("Authorization header is missing or does not start with 'Bearer '");
        return null;
    }


    public String generateTokenFromEmail(AppUser user) {
        String token = Jwts.builder()
                .subject(user.getUserEmail())
                .claim("userId", user.getUserId())
                .claim("role", user.getRole().name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key())
                .compact();

        log.debug("Generated JWT for user {}: {}", user.getUserEmail(), token);
        return token;
    }

    public String getEmailFromJwtToken(String token) {
        try {
            String email = Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();

            log.debug("Extracted email from JWT: {}", email);

            return email;
        } catch (Exception e) {
            log.error("Failed to extract email from token: {}", e.getMessage(), e);
            return null;
        }
    }

    public boolean validateJwtToken(String authToken) {
        try {
            log.debug("Validating JWT token: {}", authToken);
            Jwts.parser().verifyWith((SecretKey) key())
                    .build().parseSignedClaims(authToken);

            log.debug("JWT token is valid.");
            return true;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token (malformed): {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty or null: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected exception during JWT validation: {}", e.getMessage(), e);
        }

        return false;
    }
}
