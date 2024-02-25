package com.teamadc.backend.dto.request;

public class CommentRequest {
    private String content;
    private String timestamp;

    public CommentRequest() {}

    public CommentRequest(String content, String timestamp) {
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getContent() {
        return this.content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return this.timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
