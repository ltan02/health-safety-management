package com.teamadc.backend.dto.request;

public class CustomFieldRequest {
    private String fieldName;
    private Object value;

    public CustomFieldRequest() {}

    public CustomFieldRequest(String fieldName, Object value) {
        this.fieldName = fieldName;
        this.value = value;
    }

    public String getFieldName() {
        return this.fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public Object getValue() {
        return this.value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
