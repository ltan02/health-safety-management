package com.teamadc.backend.service;

import com.teamadc.backend.model.Comment;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.repository.GenericRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class IncidentService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final GenericRepository<Incident> incidentRepository;

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

    public List<Incident> getIncidentsByStatusId(String uid, String statusId) throws InterruptedException, ExecutionException {
        List<Incident> incidents = this.getIncidents(uid);
        return incidents.stream().filter(incident -> incident.getStatusId().equals(statusId)).toList();
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
        return incidentRepository.save(incident);
    }

    public Incident removeReviewer(String incidentId) throws InterruptedException, ExecutionException {
        Incident incident = incidentRepository.findById(incidentId);
        incident.setReviewer(null);
        return incidentRepository.save(incident);
    }
    
    public List<Incident> getIncidentsByReviewer(String reviewerId) throws InterruptedException, ExecutionException {
        return incidentRepository.findAll().stream().filter(incident -> incident.getReviewer().equals(reviewerId)).toList();
    }
}
