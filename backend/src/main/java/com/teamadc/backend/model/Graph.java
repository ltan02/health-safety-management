package com.teamadc.backend.model;


import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import com.google.cloud.firestore.annotation.DocumentId;

@Getter
@Setter
public class Graph {
    @DocumentId
    private String id;
    // Since State id is overwritten by the DocumentId annotation of the parent, store as string id instead of State object
    private List<String> states = new ArrayList<>();
    private List<String> flows = new ArrayList<>();

    public Graph() {}

    public Graph(List<String> states, List<String> flows) {
        this.states = states;
        this.flows = flows;
    }
}
