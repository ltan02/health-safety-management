package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Mail {
    private String to;
    private MailContent message;

    public Mail() {}

    public Mail(String to, MailContent message) {
        this.to = to;
        this.message = message;
    }
}
