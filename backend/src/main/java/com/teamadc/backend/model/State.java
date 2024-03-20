package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class State {
    @DocumentId
    private String id;
    private String name;
    private Coordinate coordinates;
    private String statusId;

    public State() {}

    public State(String name) {
        this.name = name;
    }

    public State(String name, String statusId) {
        this.name = name;
        this.statusId = statusId;
    }

    public State(Coordinate coordinates) {
        this.coordinates = coordinates;
    }

    public State(String name, Coordinate coordinates, String statusId) {
        this.coordinates = coordinates;
        this.name = name;
        this.statusId = statusId;
    }

    public State(String id, String name, Coordinate coordinates, String statusId) {
        this.id = id;
        this.coordinates = coordinates;
        this.name = name;
        this.statusId = statusId;
    }

}
