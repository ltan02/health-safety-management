package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class State {
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

    public State(String name, Coordinate coordinate) {
        this.coordinate = coordinate;
        this.name = name;
    }

}
