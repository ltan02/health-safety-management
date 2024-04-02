package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class StatusInsight {
    private String statusId;
    private double percentage;
    private Date date;

    public StatusInsight() {
        // Default constructor
    }

    public StatusInsight(String statusId, double percentage, Date date) {
        this.statusId = statusId;
        this.percentage = percentage;
        this.date = date;
    }
}
