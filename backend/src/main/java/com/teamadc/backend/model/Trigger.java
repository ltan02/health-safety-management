package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Trigger {
    private String eventType;

    public Trigger() {}

    public Trigger(String eventType) {
        this.eventType = eventType;
    }

}
