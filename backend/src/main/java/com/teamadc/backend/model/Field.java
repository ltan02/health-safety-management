package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Field {
    private String id;
    private String name;
    private String type;
    private FieldProp props;
    private Coordinate coordinate;
    private boolean isAi = false;
    private AiField aiField;

    public Field() {
    }

    public Field(FieldProp props) {
        this.props = props;
    }

    public Field(String name, String type, FieldProp props, Coordinate coordinate) {
        this.name = name;
        this.type = type;
        this.props = props;
        this.coordinate = coordinate;
    }

    public Field(String name, String type, FieldProp props, Coordinate coordinate, boolean isAi, AiField aiField) {
        this.name = name;
        this.type = type;
        this.props = props;
        this.coordinate = coordinate;
        this.isAi = isAi;
        this.aiField = aiField;
    }

    public Field(Coordinate coordinate) {
        this.coordinate = coordinate;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof Field)) {
            return false;
        }
        Field field = (Field) obj;
        return field.getId().equals(this.getId());
    }
}
