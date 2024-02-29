package com.teamadc.backend.model;

import java.util.Date;
import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Comment {
    @DocumentId
    private String id;
    private String userId;
    private String content;
    private Date timestamp;

    public Comment() {}

    public Comment(String id, String userId, String content) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.timestamp = new Date();
    }
}
