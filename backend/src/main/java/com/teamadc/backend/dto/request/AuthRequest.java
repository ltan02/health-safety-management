package com.teamadc.backend.dto.request;

import com.teamadc.backend.enums.Role;

public class AuthRequest {
    private String id;

    private String email;
    private Role role;
    private String firstName;
    private String lastName;

    public AuthRequest() {}

    public AuthRequest(String id, String email, String role, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.role = Role.stringToRole(role);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
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
