package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Column {
    @DocumentId
    private String id;
    private String name;
    private List<String> statusIds;
    private int order;

    public Column() {}

    public Column(String id, String name, List<String> statusIds, int order) {
        this.id = id;
        this.name = name;
        this.statusIds = statusIds;
        this.order = order;
    }

    public Column(String name, List<String> statusIds, int order) {
        this.name = name;
        this.statusIds = statusIds;
        this.order = order;
    }

    public Column(String name, List<String> statusIds) {
        this.name = name;
        this.statusIds = statusIds;
        this.order = -1;
    }
}
