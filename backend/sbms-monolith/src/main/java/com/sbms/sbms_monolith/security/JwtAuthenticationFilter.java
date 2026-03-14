package com.sbms.sbms_monolith.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);

        if (!jwtService.isTokenValid(jwt)) {
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtService.extractUsername(jwt);
        String role = jwtService.extractRole(jwt); // 

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            List<GrantedAuthority> authorities;

            if (role != null && !role.isBlank()) {
                String normalizedRole = role.trim().toUpperCase(Locale.ROOT);
                if (normalizedRole.startsWith("ROLE_")) {
                    normalizedRole = normalizedRole.substring(5);
                }
                authorities = List.of(new SimpleGrantedAuthority("ROLE_" + normalizedRole));
            } else {
                // Fallback for legacy tokens that don't carry a role claim.
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                authorities = userDetails.getAuthorities().stream()
                        .map(a -> (GrantedAuthority) new SimpleGrantedAuthority(a.getAuthority()))
                        .toList();
            }

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            authorities
                    );

            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }

}
