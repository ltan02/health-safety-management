package com.teamadc.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStatusRequest {

    private String fromColumnId;
    private String toColumnId;

    public UpdateStatusRequest() {}

    public UpdateStatusRequest(String fromColumnId, String toColumnId) {
        this.fromColumnId = fromColumnId;
        this.toColumnId = toColumnId;
    }

}
