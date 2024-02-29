package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Condition {
    private String field;
    private String operation;
    private String value;

    public Condition() {}

    public Condition(String field, String operation, String value) {
        this.field = field;
        this.operation = operation;
        this.value = value;
    }
}
