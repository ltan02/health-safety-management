package com.teamadc.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FormNameRequest {
    private String name;

    public FormNameRequest() {}

    public FormNameRequest(String name) {
        this.name = name;
    }
}
