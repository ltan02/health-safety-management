package com.teamadc.backend.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Form {
    @DocumentId
    private String id;
    private String name;
    private User author;
    private String dateAdded;
    private String dateModified;
    private List<Field> fields;

    public Form() {
    }

    public Form(String name, User author, String dateAdded, String dateModified) {
        this.name = name;
        this.author = author;
        this.dateAdded = dateAdded;
        this.dateModified = dateModified;
    }

    public Form(String name, User author) {
        this.name = name;
        this.author = author;
    }

    public Form(List<Field> fields) {
        this.fields = fields;
    }
}
