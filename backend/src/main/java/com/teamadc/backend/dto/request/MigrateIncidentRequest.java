package com.teamadc.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MigrateIncidentRequest {
    private String fromStatusId;
    private String toStatusId;

    public MigrateIncidentRequest() {}

    public MigrateIncidentRequest(String fromStatusId, String toStatusId) {
        this.fromStatusId = fromStatusId;
        this.toStatusId = toStatusId;
    }
}
