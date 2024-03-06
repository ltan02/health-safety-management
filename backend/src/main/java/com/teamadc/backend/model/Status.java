package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Status {
    private String id;
    private String name;
    private String color;

    public Status() {}

    public Status(String id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }

    public Status(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public Status(String name) {
        this.name = name;
    }

}
