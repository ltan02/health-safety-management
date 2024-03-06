package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Transition {
    private String id;
    private String name;
    private String fromStateId;
    private String toStateId;
    private List<Rule> rules;
    private String type;

    public Transition() {}

    public Transition(String fromStateId, String toStateId) {
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
    }

    public Transition(String fromStateId, String toStateId, String type, String name) {
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
        this.type = type;
        this.name = name;
    }

    public Transition(String fromStateId, String toStateId, List<Rule> rules, String type) {
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
        this.rules = rules;
        this.type = type;
    }
}
