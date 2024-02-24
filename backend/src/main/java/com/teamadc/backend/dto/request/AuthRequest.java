package com.teamadc.backend.dto.request;

import com.teamadc.backend.enums.Role;

public class AuthRequest {

    private String email;
    private String password;
    private Role role;
    private String firstName;
    private String lastName;

    public AuthRequest() {}

    public AuthRequest(String email, String password, String role, String firstName, String lastName) {
        this.email = email;
        this.password = password;
        this.role = Role.stringToRole(role);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
