package com.sbms.sbms_monolith.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm ->
                    sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
            		// .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            		.requestMatchers("/api/admin/**").hasRole("ADMIN")

                .requestMatchers(
                        "/api/auth/**",
                        "/api/boardings",
                        "/api/boardings/**" ,
                        
                        "/ws/**",

                        "/api/users/public/**",
                        
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()

             //   .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                .requestMatchers("/api/payments/**").hasAnyRole("STUDENT", "OWNER")

                .requestMatchers("/api/owner/**").hasRole("OWNER")
                .requestMatchers("/api/boardings/owner/**").hasRole("OWNER")

                .requestMatchers("/api/reports/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/reports/**").hasAnyRole("STUDENT", "OWNER")

                .requestMatchers("/api/student/**").hasRole("STUDENT")
                .requestMatchers("/api/bills/student/**").hasRole("STUDENT")
                

                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        // NEW constructor (Spring Security 6.3)
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }
    
   

  
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {

        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	
	    CorsConfiguration config = new CorsConfiguration();
	
	    // Allow frontend domains
	    config.setAllowedOriginPatterns(List.of(
	            "https://smartboard.thareesha.software",
	            "http://localhost:5173"
	    ));
	
	    // Allow HTTP methods
	    config.setAllowedMethods(List.of(
	            "GET",
	            "POST",
	            "PUT",
	            "DELETE",
	            "PATCH",
	            "OPTIONS"
	    ));
	
	    // Allow all headers
	    config.setAllowedHeaders(List.of("*"));
	
	    // Allow credentials (JWT cookies / auth headers)
	    config.setAllowCredentials(true);
	
	    // Cache preflight response (performance)
	    config.setMaxAge(3600L);
	
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);
	
	    return source;
	}


	
}
