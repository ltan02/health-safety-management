package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Transition {
    @DocumentId
    private String id;
    private String label;
    private String fromStateId;
    private String toStateId;
    private List<Rule> rules;
    private String type;

    public Transition() {}

    public Transition(String fromStateId, String toStateId) {
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
    }

    public Transition(String fromStateId, String toStateId, String label) {
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
        this.label = label;
    }

    public Transition(String fromStateId, String toStateId, List<Rule> rules, String type) {
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
        this.rules = rules;
        this.type = type;
    }

    public Transition(String id, String fromStateId, String toStateId, List<Rule> rules, String type) {
        this.id = id;
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
        this.rules = rules;
        this.type = type;
    }

    public Transition(String id, String fromStateId, String toStateId, String label, List<Rule> rules, String type) {
        this.id = id;
        this.fromStateId = fromStateId;
        this.toStateId = toStateId;
        this.label = label;
        this.rules = rules;
        this.type = type;
    }
}
