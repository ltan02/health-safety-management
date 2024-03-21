package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class Workflow {
    @DocumentId
    private String id;
    private String name;
    private boolean active;
    private List<String> stateIds;
    private List<String> transitionIds;
    private String boardId;
    private String lastUpdated;

    public Workflow() {}

    public Workflow(String id, String name, boolean active, List<String> stateIds, List<String> transitionIds, String boardId, String lastUpdated) {
        this.id = id;
        this.name = name;
        this.active = active;
        this.stateIds = stateIds;
        this.transitionIds = transitionIds;
        this.boardId = boardId;
        this.lastUpdated = lastUpdated;
    }

    public Workflow(String name, boolean active, List<String> stateIds, List<String> transitionIds) {
        this.name = name;
        this.active = active;
        this.stateIds = stateIds;
        this.transitionIds = transitionIds;
    }

    public boolean getActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<String> getStateIds() {
        return stateIds;
    }

    public void setStateIds(List<String> stateIds) {
        this.stateIds = stateIds;
    }

    public List<String> getTransitionIds() {
        return transitionIds;
    }

    public void setTransitionIds(List<String> transitionIds) {
        this.transitionIds = transitionIds;
    }

}
