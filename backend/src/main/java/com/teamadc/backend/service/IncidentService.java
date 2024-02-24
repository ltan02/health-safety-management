package com.teamadc.backend.service;

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
        return incidents.stream().filter(incident -> incident.getReporter().equals(uid)).toList();
    }
}
