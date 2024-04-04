package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AiField {
    private String prompt;
    private String referenceId;

    public AiField() {
    }

    public AiField(String prompt, String referenceId) {
        this.prompt = prompt;
        this.referenceId = referenceId;
    }
    
}
