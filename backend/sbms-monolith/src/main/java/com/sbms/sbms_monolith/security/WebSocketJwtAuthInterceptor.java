/*package com.sbms.sbms_monolith.security;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.*;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketJwtAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String rawAuth = accessor.getFirstNativeHeader("Authorization");
            if (rawAuth == null) {
                rawAuth = accessor.getFirstNativeHeader("authorization");
            }

            if (rawAuth == null || !rawAuth.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Missing Authorization header");
            }

            String token = rawAuth.substring(7).trim();

            if (!jwtService.isTokenValid(token)) {
                throw new IllegalArgumentException("Invalid JWT");
            }

            String username = jwtService.extractUsername(token);
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            accessor.setUser(auth);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        return message;
    }
}*/





package com.sbms.sbms_monolith.security;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.*;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WebSocketJwtAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) {
            return message;
        }

        // ✅ Authenticate ONLY on CONNECT
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String rawAuth = accessor.getFirstNativeHeader("Authorization");
            if (rawAuth == null) {
                rawAuth = accessor.getFirstNativeHeader("authorization");
            }

            // ❌ Reject silently (SockJS-safe)
            if (rawAuth == null || !rawAuth.startsWith("Bearer ")) {
                return null;
            }

            String token = rawAuth.substring(7).trim();

            if (!jwtService.isTokenValid(token)) {
                return null;
            }

            String username = jwtService.extractUsername(token);
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(username);
            
            Long userId = jwtService.extractUserId(token); 

            
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                    		 userId.toString(),   
                            null,
                            userDetails.getAuthorities()
                    );
            System.out.println("WS CONNECT USER = " + auth.getName());


            // ✅ THIS IS THE ONLY REQUIRED STEP
            accessor.setUser(auth);
        }

        return message;
    }
}

