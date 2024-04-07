package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Rule {
    private String type;
    private List<String> userIds;
    private List<String> roles;

    public Rule() {}

    public Rule(String type, List<String> userIds, List<String> roles) {
        this.type = type;
        this.userIds = userIds;
        this.roles = roles;
    }
}
