package com.teamadc.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CommentRequest {
    private String content;

    public CommentRequest() {}

    public CommentRequest(String content) {
        this.content = content;
    }

}
