package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Graph {
    private String field;
    private String end;
    private String start;
    private String type;
    private String name;

    public Graph() {
        this.field = "category";
        this.type = "bar";
    }


    public Graph(String field, String type) {
        this.field = field;
        this.type = type;
    }

    public Graph(String field, String type, String start, String end, String name) {
        this.field = field;
        this.type = type;
        this.end = end;
        this.start = start;
        this.name = name;
    }
}
