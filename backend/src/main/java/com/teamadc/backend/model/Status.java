package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Status {
    @DocumentId
    private String id;
    private String name;

    public Status() {}

    public Status(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public Status(String name) {
        this.name = name;
    }

}
