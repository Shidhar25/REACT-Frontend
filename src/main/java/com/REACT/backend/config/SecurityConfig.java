package com.REACT.backend.config;

import com.REACT.backend.Jwt.AuthEntryPointJWT;
import com.REACT.backend.Jwt.AuthTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthTokenFilter authTokenFilter;
    private final AuthEntryPointJWT unauthorizedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("🔐 Configuring Security Filter Chain...");

        return http
                .cors(withDefaults())
                .csrf(csrf -> {
                    System.out.println("🔐 CSRF Disabled");
                    csrf.disable();
                })
                .exceptionHandling(ex -> {
                    System.out.println("🔐 Setting up Authentication Entry Point");
                    ex.authenticationEntryPoint(unauthorizedHandler);
                })
                .sessionManagement(sess -> {
                    System.out.println("🔐 Stateless Session Policy");
                    sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                .authorizeHttpRequests(auth -> {
                    System.out.println("🔐 Configuring Public Endpoints and Role-based Access");
                    auth
                            .requestMatchers(
                                    "/auth/**",
                                    "/swagger-ui/**",
                                    "/v3/api-docs/**",
                            "/api/dashboard/stats",
                           "/", "/login", "/oauth2/**"
                            ).permitAll()
                            .anyRequest().authenticated();
                })
                .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
//     "/ws-location/**",
//                                "/location-map/**",
//                                "/fire/**",
//                                "/location/**",
//                                "/driver/**"