package com.teamadc.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CustomFieldRequest {
    private String fieldName;
    private Object value;

    public CustomFieldRequest() {}

    public CustomFieldRequest(String fieldName, Object value) {
        this.fieldName = fieldName;
        this.value = value;
    }

}
