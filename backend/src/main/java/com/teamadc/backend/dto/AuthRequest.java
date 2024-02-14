package com.teamadc.backend.dto;

import com.teamadc.backend.enums.Role;

public class AuthRequest {

    private String email;
    private String password;
    private Role role;

    public AuthRequest(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = Role.stringToRole(role);
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public Role getRole() {
        return this.role;
    }
}
