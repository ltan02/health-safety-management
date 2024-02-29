package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Action {
    private String actionType;
    private String parameters;

    public Action() {}

    public Action(String actionType, String parameters) {
        this.actionType = actionType;
        this.parameters = parameters;
    }
}
