package com.sbms.sbms_monolith.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
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
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
        return factory -> factory.addConnectorCustomizers(connector -> {
            connector.setMaxParameterCount(50);
            connector.setMaxPartCount(20);
        });
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // -----------------------------------------------------------
                        // PUBLIC ENDPOINTS (MUST BE FIRST)
                        // -----------------------------------------------------------
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/boardings/**").permitAll()
                        .requestMatchers(
                                "/api/users/public/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // -----------------------------------------------------------
                        // ADMIN ENDPOINTS
                        // -----------------------------------------------------------
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/reports/admin/**").hasRole("ADMIN")

                        // -----------------------------------------------------------
                        // OWNER ENDPOINTS
                        // -----------------------------------------------------------
                        .requestMatchers("/api/owner/**").hasRole("OWNER")
                        .requestMatchers("/api/boardings/owner/**").hasRole("OWNER")
                        .requestMatchers("/api/technician-workflow/search").hasRole("OWNER")
                        .requestMatchers("/api/technician-workflow/*/assign/*").hasRole("OWNER")
                        .requestMatchers("/api/technician-workflow/*/review").hasRole("OWNER")
                        .requestMatchers("/api/payments/intent/technician").hasRole("OWNER")

                        // -----------------------------------------------------------
                        // TECHNICIAN ENDPOINTS
                        // -----------------------------------------------------------
                        .requestMatchers("/api/technician-workflow/my-jobs").hasAnyAuthority("ROLE_TECHNICIAN", "TECHNICIAN")
                        .requestMatchers("/api/technician-workflow/*/decision").hasAnyAuthority("ROLE_TECHNICIAN", "TECHNICIAN")
                        .requestMatchers("/api/technician-workflow/*/complete").hasAnyAuthority("ROLE_TECHNICIAN", "TECHNICIAN")
                        .requestMatchers("/api/technician-workflow/profile").hasAnyAuthority("ROLE_TECHNICIAN", "TECHNICIAN")

                        // -----------------------------------------------------------
                        // STUDENT ENDPOINTS (BILLING & PAYMENTS) 💰
                        // -----------------------------------------------------------
                        .requestMatchers("/api/student/**").hasRole("STUDENT")
                        .requestMatchers("/api/bills/student/**").hasRole("STUDENT")
                        .requestMatchers("/api/bills/student").hasRole("STUDENT")  // ✅ Added this
                        .requestMatchers("/api/payments/**").hasRole("STUDENT")
                        .requestMatchers("/api/payment/**").hasRole("STUDENT")      // ✅ Fixed this
                        .requestMatchers("/api/payments/history").hasRole("STUDENT") // ✅ Added this

                        // -----------------------------------------------------------
                        // REPORTS - SHARED ACCESS (STUDENT, OWNER, TECHNICIAN)
                        // -----------------------------------------------------------
                        .requestMatchers(HttpMethod.POST, "/api/reports").hasAnyAuthority(
                                "ROLE_TECHNICIAN", "TECHNICIAN",
                                "ROLE_OWNER", "OWNER",
                                "ROLE_STUDENT", "STUDENT",
                                "ROLE_ADMIN", "ADMIN"
                        )
                        .requestMatchers("/api/reports/**").hasAnyAuthority(
                                "ROLE_TECHNICIAN", "TECHNICIAN",
                                "ROLE_OWNER", "OWNER",
                                "ROLE_STUDENT", "STUDENT",
                                "ROLE_ADMIN", "ADMIN"
                        )

                        // File uploads for reports
                        .requestMatchers("/api/files/upload/**").hasAnyAuthority(
                                "ROLE_TECHNICIAN", "TECHNICIAN",
                                "ROLE_OWNER", "OWNER",
                                "ROLE_STUDENT", "STUDENT"
                        )

                        // -----------------------------------------------------------
                        // REGISTRATIONS - ANY AUTHENTICATED USER
                        // -----------------------------------------------------------
                        .requestMatchers("/api/registrations/**").authenticated()

                        // -----------------------------------------------------------
                        // ALL OTHER REQUESTS MUST BE AUTHENTICATED
                        // -----------------------------------------------------------
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

      /*  config.setAllowedOrigins(List.of(
        		"https://smartboard.thareesha.software",
                "http://13.233.34.226:8086",
                "http://localhost:5173"
        		)); */
       // config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        
        
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
       
        config.setAllowedHeaders(List.of("*"));
        
     /*   config.setAllowedHeaders(List.of(
        	    "Authorization",
        	    "Content-Type"
        	));
*/
        
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
