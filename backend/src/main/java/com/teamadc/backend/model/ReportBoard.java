package com.teamadc.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.google.cloud.firestore.annotation.DocumentId;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ReportBoard {
    @DocumentId
    private String id;
    private String userId;
    private List<Graph> graphs;

    public ReportBoard() {
    }

    public ReportBoard(String id, String userId) {
        this.id = id;
        this.userId = userId;
        List<Graph> graphs = new ArrayList<>();
        graphs.add(new Graph("category", "Bar"));
        graphs.add(new Graph("reporter", "Line"));
        graphs.add(new Graph("status", "Pie"));
        graphs.add(new Graph("date", "Scatter"));
        this.graphs = graphs;
    }
    
    public ReportBoard(String id, String userId, List<Graph> graphs) {
        this.id = id;
        this.userId = userId;
        this.graphs = graphs;
    }
}
