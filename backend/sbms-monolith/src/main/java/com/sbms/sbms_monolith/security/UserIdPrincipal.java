package com.sbms.sbms_monolith.security;


import java.security.Principal;

public class UserIdPrincipal implements Principal {

    private final String name;

    public UserIdPrincipal(Long userId) {
        this.name = userId.toString();
    }

    @Override
    public String getName() {
        return name;
    }
}