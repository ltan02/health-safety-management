package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusCategoryCount {
    private String statusId;
    private int count;

    public StatusCategoryCount() {
        // Default constructor
    }

    public StatusCategoryCount(String statusId, int count) {
        this.statusId = statusId;
        this.count = count;
    }
}
