package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import com.teamadc.backend.model.User;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Group {
    @DocumentId
    private String id;
    private String name;
    private String description;
    private List<String> members;

    public Group() {
    }

    public Group(String id, String name, String description, List<String> members) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.members = members;
    }

    public Group(String name) {
        this.name = name;
    }

    public Group(List<String> members) {
        this.members = members;
    }

}
