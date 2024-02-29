package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Rule {
    @DocumentId
    private String id;
    private String description;
    private Trigger trigger;
    private List<Condition> conditions;
    private List<Action> actions;

    public Rule() {}

    public Rule(String id, String description, Trigger trigger, List<Condition> conditions, List<Action> actions) {
        this.id = id;
        this.description = description;
        this.trigger = trigger;
        this.conditions = conditions;
        this.actions = actions;
    }

    public Rule(String description, Trigger trigger, List<Condition> conditions, List<Action> actions) {
        this.description = description;
        this.trigger = trigger;
        this.conditions = conditions;
        this.actions = actions;
    }
}
