package com.teamadc.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommentRequest {
    private String content;
    private String timestamp;

    public CommentRequest() {}

    public CommentRequest(String content, String timestamp) {
        this.content = content;
        this.timestamp = timestamp;
    }

}
