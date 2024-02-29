package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Workflow {
    @DocumentId
    private String id;
    private String name;
    private boolean isActive;
    private List<State> states;
    private List<Transition> transitions;

    public Workflow() {}

    public Workflow(String id, String name, boolean isActive, List<State> states, List<Transition> transitions) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
        this.states = states;
        this.transitions = transitions;
    }

    public Workflow(String name, boolean isActive, List<State> states, List<Transition> transitions) {
        this.name = name;
        this.isActive = isActive;
        this.states = states;
        this.transitions = transitions;
    }

}
