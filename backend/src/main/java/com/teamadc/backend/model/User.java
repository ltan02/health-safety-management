package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.teamadc.backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class User {
    @DocumentId
    private String id;
    private String email;
    private String role;
    private String businessUnit;
    private String firstName;
    private String lastName;

    private boolean admin;
    private boolean safetyWarden;
    private boolean employee;

    public User() {}

    public User(String id, String email, String role, String businessUnit, String firstName, String lastName) {
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

    public boolean checkIsAdmin() {
        return this.role == Role.ADMIN.name();
    }

    public boolean checkIsSafetyWarden() {
        return this.role == Role.SAFETY_WARDEN.name();
    }

    public boolean checkIsEmployee() {
        return this.role == Role.EMPLOYEE.name();
    }

}
