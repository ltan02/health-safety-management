package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class FieldProp {
    private String id;
    private String label;
    private String name;
    private boolean required;
    private String placeholder;
    private String description;
    private List<FieldOption> options;

    public FieldProp() {}

    public FieldProp(String label, String name, boolean required, String placeholder, String description, List<FieldOption> options) {
        this.label = label;
        this.name = name;
        this.required = required;
        this.placeholder = placeholder;
        this.description = description;
        this.options = options;
    }
}
