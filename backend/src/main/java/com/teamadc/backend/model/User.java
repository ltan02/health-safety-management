package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.teamadc.backend.enums.Role;

public class User {
    @DocumentId
    private String id;
    private String email;
    private Role role;
    private String businessUnit;
    private String firstName;
    private String lastName;

    private boolean admin;
    private boolean safetyWarden;
    private boolean employee;

    public User() {}

    public User(String id, String email, Role role, String businessUnit, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.businessUnit = businessUnit;
        this.firstName = firstName;
        this.lastName = lastName;

        this.admin = checkIsAdmin();
        this.safetyWarden = checkIsSafetyWarden();
        this.employee = checkIsEmployee();
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

    public boolean checkIsAdmin() {
        return this.role == Role.ADMIN;
    }

    public boolean checkIsSafetyWarden() {
        return this.role == Role.SAFETY_WARDEN;
    }

    public boolean checkIsEmployee() {
        return this.role == Role.EMPLOYEE;
    }

    public String getBusinessUnit() {
        return this.businessUnit;
    }

    public void setBusinessUnit(String businessUnit) {
        this.businessUnit = businessUnit;
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

    public boolean getAdmin() {
        return this.admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean getSafetyWarden() {
        return this.safetyWarden;
    }

    public void setSafetyWarden(boolean safetyWarden) {
        this.safetyWarden = safetyWarden;
    }

    public boolean getEmployee() {
        return this.employee;
    }

    public void setEmployee(boolean employee) {
        this.employee = employee;
    }
}
