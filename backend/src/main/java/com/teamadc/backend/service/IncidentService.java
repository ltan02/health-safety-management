package com.teamadc.backend.service;

import com.teamadc.backend.dto.request.CustomFieldRequest;
import com.teamadc.backend.model.Comment;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.repository.GenericRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class IncidentService {
    private static final Logger logger = LoggerFactory.getLogger(IncidentService.class);
    private final GenericRepository<Incident> incidentRepository;
    private static final SimpleDateFormat dateTimeFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");

    @Autowired
    public IncidentService(GenericRepository<Incident> incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public Incident createOrUpdateIncident(Incident incident) throws InterruptedException, ExecutionException {
        return incidentRepository.save(incident);
    }

    public void deleteIncident(String incidentId) throws InterruptedException, ExecutionException {
        incidentRepository.deleteById(incidentId);
    }

    public Incident getIncidentById(String incidentId) throws InterruptedException, ExecutionException {
        return incidentRepository.findById(incidentId);
    }

    public List<Incident> getIncidents(String uid) throws InterruptedException, ExecutionException {
        List<Incident> incidents = incidentRepository.findAll();
        return incidents.stream().filter(incident -> incident.getReporter().equals(uid) || incident.getEmployeesInvolved().contains(uid)).toList();
    }

    public List<Incident> getIncidents() throws InterruptedException, ExecutionException {
         return incidentRepository.findAll();
    }

    public List<Incident> getIncidentsByStatusId(String statusId) throws InterruptedException, ExecutionException {
        List<Incident> incidents = incidentRepository.findAll();
        return incidents.stream().filter(incident -> incident.getStatusId().equals(statusId)).toList();
    }

    public Incident updateCustomFields(String incidentId, List<CustomFieldRequest> customFields) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);

        for (CustomFieldRequest customField : customFields) {
            incident.setCustomField(customField.getFieldName(), customField.getValue());
        }

        return updateModifiedAt(incident);
    }

    public Incident addComment(String incidentId, Comment comment) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);

        List<Comment> comments = incident.getComments();
        comments.add(comment);

        incident.setComments(comments);

        incidentRepository.save(incident);

        return incident;
    }

    public Incident deleteComment(String incidentId, String commentId) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);

        List<Comment> comments = incident.getComments();
        comments.removeIf(comment -> comment.getId().equals(commentId));

        incident.setComments(comments);

        incidentRepository.save(incident);

        return incident;
    }

    public Incident assignReviewer(String incidentId, String reviewerId) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);
        incident.setReviewer(reviewerId);
        return updateModifiedAt(incident);
    }

    public Incident removeReviewer(String incidentId) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);
        incident.setReviewer(null);
        return updateModifiedAt(incident);
    }

    public Incident updateDate (String incidentId, String date) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);
        incident.setIncidentDate(date);
        return updateModifiedAt(incident);
    }
    
    public List<Incident> getIncidentsByReviewer(String reviewerId) throws InterruptedException, ExecutionException {
        return incidentRepository.findAll().stream().filter(incident -> incident.getReviewer().equals(reviewerId)).toList();
    }

    public Incident updateModifiedAt(Incident incident) throws InterruptedException, ExecutionException {
        incident.setLastUpdatedAt(new Date());
        return incidentRepository.save(incident);
    }

    public Incident updateReporter(String incidentId, String userId) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);
        incident.setReporter(userId);
        return updateModifiedAt(incident);
    }

    public Incident updateCategory(String incidentId, String category) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);
        incident.setIncidentCategory(category);
        return updateModifiedAt(incident);
    }

    public Incident updateEmployeesInvolved(String incidentId, List<String> employeesInvolved) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);
        incident.setEmployeesInvolved(employeesInvolved);
        return updateModifiedAt(incident);
    }

    public List<Incident> findIncidentsBetween(Date start, Date end) {
        List<Incident> allIncidents;
        try {
            allIncidents = incidentRepository.findAll(); // Fetch all incidents
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error fetching incidents", e);
            return new ArrayList<>(); // Return an empty list or handle appropriately
        }
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
        return allIncidents.stream()
                .filter(incident -> {
                    try {
                        Date incidentDate = formatter.parse(incident.getIncidentDate());
                        if (start == null) {
                            return (end == null) || !incidentDate.after(end);
                        }
                        // If start is not null but end is, only check that the incident is on or after start
                        if (end == null) {
                            return !incidentDate.before(start);
                        }
                        // If both start and end are not null, check that the incident is within the range
                        return !incidentDate.before(start) && !incidentDate.after(end);
                    } catch (ParseException e) {
                        return false;
                    }
                })
                .collect(Collectors.toList());
    }

    public long totalIncidents() {
        try {
            List<Incident> allIncidents = incidentRepository.findAll();
            return allIncidents.size();
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error fetching the total count of incidents", e);
            return 0;
        }
    }

    public Date findEarliestIncidentDate() {
        // Fetch all incidents
        List<Incident> allIncidents;
        try {
            allIncidents = incidentRepository.findAll();
        } catch (InterruptedException | ExecutionException e) {
            logger.error("Error fetching incidents", e);
            return null; // Handle this as appropriate
        }

        // Find the earliest date among all incidents
        return allIncidents.stream()
                .map(Incident::getIncidentDate)
                .filter(Objects::nonNull) // Ensure the date is not null
                .map(dateStr -> {
                    try {
                        return dateTimeFormatter.parse(dateStr);
                    } catch (Exception e) {
                        logger.error("Error parsing date: " + dateStr, e);
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .min(Comparator.naturalOrder())
                .orElse(null); // Return null if no incidents are found or all dates are null
    }

    public void migrateIncidents(String fromStatusId, String toStatusId) throws InterruptedException, ExecutionException {
        List<Incident> incidents = incidentRepository.findAll();
        for (Incident incident : incidents) {
            if (incident.getStatusId().equals(fromStatusId)) {
                incident.setStatusId(toStatusId);
                incidentRepository.save(incident);
            }
        }
    }
}
