package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Flow {
    @DocumentId
    private String id;
    private String from;
    private String to;
    private String name;

    public Flow() {}

    public Flow(String id, String name, String from, String to) {
        this.id = id;
        this.name = name;
        this.from = from;
        this.to = to;
    }

}
