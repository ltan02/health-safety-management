package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Transition {
    private String fromStateId;
    private String toStateId;
    private List<Rule> rules;
    private String type;
    private List<Coordinate> coordinates;

    public Transition() {}

    public Transition(String fromStateId, String toStateId, List<Rule> rules, String type, List<Coordinate> coordinates) {
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
        this.rules = rules;
        this.type = type;
        this.coordinates = coordinates;
    }
}
