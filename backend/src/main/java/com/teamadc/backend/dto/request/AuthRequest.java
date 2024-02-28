package com.teamadc.backend.dto.request;

import com.teamadc.backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
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

}
