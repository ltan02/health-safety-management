package com.teamadc.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusResponse {

    private String id;
    private String name;
    private int count;

    public StatusResponse() {}

    public StatusResponse(String id, String name, int count) {
        this.id = id;
        this.name = name;
        this.count = count;
    }

}
