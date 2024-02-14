package com.teamadc.backend.model;

import com.teamadc.backend.enums.Role;

public class User {
    private String id;
    private Role role;
    private String businessUnit;

    public User() {}

    public User(String id, Role role, String businessUnit) {
        this.id = id;
        this.role = role;
        this.businessUnit = businessUnit;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }

    public boolean isSafetyWarden() {
        return this.role == Role.SAFETY_WARDEN;
    }

    public boolean isEmployee() {
        return this.role == Role.EMPLOYEE;
    }

    public String getBusinessUnit() {
        return this.businessUnit;
    }

    public void setBusinessUnit(String businessUnit) {
        this.businessUnit = businessUnit;
    }
}
