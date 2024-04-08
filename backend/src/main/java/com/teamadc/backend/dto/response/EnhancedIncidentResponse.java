package com.teamadc.backend.dto.response;

import com.teamadc.backend.model.Comment;
import com.teamadc.backend.model.StatusHistory;
import com.teamadc.backend.model.User;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class EnhancedIncidentResponse {
    private String id;
    private String incidentDate;
    private String incidentCategory;
    private User reporter;
    private List<User> employeesInvolved;
    private String statusId;
    private User reviewer;
    private List<Comment> comments;
    private Date createdAt;
    private Date lastUpdatedAt;
    private Map<String, Object> customFields;
    private List<StatusHistory> statusHistory;

    public EnhancedIncidentResponse() {}

    public EnhancedIncidentResponse(String id, String incidentDate, String incidentCategory, User reporter, List<User> employeesInvolved, String statusId, User reviewer, List<Comment> comments, Date createdAt, Date lastUpdatedAt, Map<String, Object> customFields, List<StatusHistory> statusHistory) {
        this.id = id;
        this.incidentDate = incidentDate;
        this.incidentCategory = incidentCategory;
        this.reporter = reporter;
        this.employeesInvolved = employeesInvolved;
        this.statusId = statusId;
        this.reviewer = reviewer;
        this.comments = comments;
        this.createdAt = createdAt;
        this.lastUpdatedAt = lastUpdatedAt;
        this.customFields = customFields;
        this.statusHistory = statusHistory;
    }
}
