package com.teamadc.backend.model;

import java.util.Date;
import com.google.cloud.firestore.annotation.DocumentId;

public class Comment {
    @DocumentId
    private String id;
    private String userId;
    private String content;
    private Date createdAt;
    private Date lastUpdatedAt;

    public Comment() {}

    public Comment(String id, String userId, String content) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.createdAt = new Date();
        this.lastUpdatedAt = new Date();
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.lastUpdatedAt = new Date();
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.lastUpdatedAt = new Date();
        this.userId = userId;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.lastUpdatedAt = new Date();
        this.content = content;
    }

    public Date getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.lastUpdatedAt = new Date();
        this.createdAt = createdAt;
    }

    public Date getLastUpdatedAt() {
        return this.lastUpdatedAt;
    }

    public void setLastUpdatedAt(Date lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }
}
