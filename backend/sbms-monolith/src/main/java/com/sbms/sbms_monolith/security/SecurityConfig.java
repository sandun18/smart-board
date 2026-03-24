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
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // -------------------------------------------------------
                        // PUBLIC ENDPOINTS
                        // -------------------------------------------------------
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/boardings/**").permitAll()
                        .requestMatchers(
                                "/api/users/public/**",
                                        "/api/public/**",
                                        "/api/third-party-ads/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers( "/ws/**", "/backend-ws/**").permitAll()

                        // -------------------------------------------------------
                        // ADMIN ENDPOINTS
                        // -------------------------------------------------------
                        .requestMatchers("/api/admin/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ADMIN")
                        .requestMatchers("/api/reports/admin/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ADMIN")

                        // -------------------------------------------------------
                        // OWNER ENDPOINTS
                        // -------------------------------------------------------
                        .requestMatchers("/api/owner/**")
                        .hasAnyAuthority("ROLE_OWNER", "OWNER")
                        .requestMatchers("/api/boardings/owner/**")
                        .hasAnyAuthority("ROLE_OWNER", "OWNER")
                        .requestMatchers("/api/technician-workflow/search")
                        .hasAnyAuthority("ROLE_OWNER", "OWNER")
                        .requestMatchers("/api/technician-workflow/*/assign/*")
                        .hasAnyAuthority("ROLE_OWNER", "OWNER")
                        .requestMatchers("/api/technician-workflow/*/review")
                        .hasAnyAuthority("ROLE_OWNER", "OWNER")
                        .requestMatchers("/api/payments/intent/technician")
                        .hasAnyAuthority("ROLE_OWNER", "OWNER")

                        // -------------------------------------------------------
                        // TECHNICIAN ENDPOINTS
                        // -------------------------------------------------------
                        .requestMatchers("/api/technician-workflow/my-jobs")
                        .hasAnyAuthority("ROLE_TECHNICIAN", "TECHNICIAN")
                        .requestMatchers("/api/technician-workflow/*/decision")
                        .hasAnyAuthority("ROLE_TECHNICIAN", "TECHNICIAN")
                        .requestMatchers("/api/technician-workflow/*/complete")
                        .hasAnyAuthority("ROLE_TECHNICIAN", "TECHNICIAN")
                        .requestMatchers("/api/technician-workflow/profile")
                        .hasAnyAuthority("ROLE_TECHNICIAN", "TECHNICIAN")
                        .requestMatchers("/api/technician-workflow/reviews")
                        .hasAnyAuthority("ROLE_TECHNICIAN", "TECHNICIAN")

                        // -------------------------------------------------------
                        // STUDENT ENDPOINTS
                        // -------------------------------------------------------
                        .requestMatchers("/api/student/**")
                        .hasAnyAuthority("ROLE_STUDENT", "STUDENT")
                        .requestMatchers("/api/bills/student/**")
                        .hasAnyAuthority("ROLE_STUDENT", "STUDENT")
                        .requestMatchers("/api/bills/student")
                        .hasAnyAuthority("ROLE_STUDENT", "STUDENT")
                        .requestMatchers("/api/payments/**")
                        .hasAnyAuthority("ROLE_STUDENT", "STUDENT")
                        .requestMatchers("/api/payments/history")
                        .hasAnyAuthority("ROLE_STUDENT", "STUDENT")

                        // -------------------------------------------------------
                        // REPORTS — SHARED (STUDENT, OWNER, TECHNICIAN, ADMIN)
                        // -------------------------------------------------------
                        .requestMatchers(HttpMethod.POST, "/api/reports")
                        .hasAnyAuthority(
                                "ROLE_TECHNICIAN", "TECHNICIAN",
                                "ROLE_OWNER", "OWNER",
                                "ROLE_STUDENT", "STUDENT",
                                "ROLE_ADMIN", "ADMIN"
                        )
                        .requestMatchers("/api/reports/**")
                        .hasAnyAuthority(
                                "ROLE_TECHNICIAN", "TECHNICIAN",
                                "ROLE_OWNER", "OWNER",
                                "ROLE_STUDENT", "STUDENT",
                                "ROLE_ADMIN", "ADMIN"
                        )

                        // File uploads
                        .requestMatchers("/api/files/upload/**")
                        .hasAnyAuthority(
                                "ROLE_TECHNICIAN", "TECHNICIAN",
                                "ROLE_OWNER", "OWNER",
                                "ROLE_STUDENT", "STUDENT"
                        )

                        // -------------------------------------------------------
                        // REGISTRATIONS — any authenticated user
                        // (fine-grained control handled by @PreAuthorize in controller)
                        // -------------------------------------------------------
                        .requestMatchers("/api/registrations/**").authenticated()

                        // -------------------------------------------------------
                        // ALL OTHER REQUESTS
                        // -------------------------------------------------------
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
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
