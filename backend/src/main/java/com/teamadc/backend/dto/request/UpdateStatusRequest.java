package com.teamadc.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStatusRequest {
    private String type;
    private String toColumnId;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(String type, String toColumnId) {
        this.type = type;
        this.toColumnId = toColumnId;
    }

}
