package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailContent {
    private String subject;
    private String text;
    private String html;

    public MailContent() {}

    public MailContent(String subject, String text, String html) {
        this.subject = subject;
        this.text = text;
        this.html = html;
    }
}
