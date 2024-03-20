package com.teamadc.backend.dto.request;

import com.teamadc.backend.model.Coordinate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FieldCoordinateRequest {

    private String id;
    private Coordinate coordinate;

    public FieldCoordinateRequest() {}

    public FieldCoordinateRequest(String id, Coordinate coordinate) {
        this.id = id;
        this.coordinate = coordinate;
    }

}
