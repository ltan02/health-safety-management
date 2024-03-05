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
    private Coordinate coordinate;

    public State() {}

    public State(String name) {
        this.name = name;
    }

    public State(Coordinate coordinate) {
        this.coordinate = coordinate;
    }

    public State(String id, String name, Coordinate coordinate) {
        this.id = id;
        this.name = name;
        this.coordinate = coordinate;
    }

}
