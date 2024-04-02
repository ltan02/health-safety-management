package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class StatusHistory {
    private String statusId;
    private String userId;
    private Date date;

    public StatusHistory() {}

    public StatusHistory(String statusId, String userId, Date date) {
        this.statusId = statusId;
        this.userId = userId;
        this.date = date;
    }
}
