package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class State {
    private String statusId;
    private String name;
    private Coordinate coordinate;

    public State() {}

    public State(String statusId, String name, Coordinate coordinate) {
        this.statusId = statusId;
        this.name = name;
        this.coordinate = coordinate;
    }

}
