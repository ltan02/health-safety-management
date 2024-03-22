package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Report {
    private int id;
    private String label;
    private int value;

    public Report() {}

    public Report(int id, String label, int value) {
        this.id = id;
        this.label = label;
        this.value = value;
    }
}
