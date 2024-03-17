package com.teamadc.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateColumnRequest {
    private String boardType; // "ADMIN" or "EMPLOYEE"

    public CreateColumnRequest() {}

    public CreateColumnRequest(String boardType) {
        this.boardType = boardType;
    }

}
