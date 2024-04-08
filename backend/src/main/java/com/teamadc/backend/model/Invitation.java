package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Invitation {
    @DocumentId
    private String id;
    private String email;
    private String role;
    private boolean isActive;

    public Invitation() {}

    public Invitation(String email, String role, boolean isActive) {
        this.email = email;
        this.role = role;
        this.isActive = isActive;
    }

    public Invitation(String id, String email, String role, boolean isActive) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
    }

}
