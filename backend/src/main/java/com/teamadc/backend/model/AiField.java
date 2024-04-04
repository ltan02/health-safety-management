package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AiField {
    private String prompt;
    private List<String> referenceId;

    public AiField() {
    }

    public AiField(String prompt, List<String> referenceId) {
        this.prompt = prompt;
        this.referenceId = referenceId;
    }

    public AiField(String prompt, String referenceId) {
        this.prompt = prompt;
        this.referenceId = List.of(referenceId);
    }
    
}
