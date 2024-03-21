package com.teamadc.backend.service;

import com.teamadc.backend.model.Report;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.repository.GenericRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final GenericRepository<Incident> incidentRepository;

    @Autowired
    public ReportService(GenericRepository<Incident> incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<Report> getReports(String type) throws InterruptedException, ExecutionException {
        List<Incident> incidents = incidentRepository.findAll();
        Map<String, Long> groupedIncidents = incidents.stream()
            .collect(Collectors.groupingBy(incident -> {
                switch (type) {
                    case "date":
                        return incident.getIncidentDate();
                    case "category":
                        return incident.getIncidentCategory();
                    case "reporter":
                        return incident.getReporter();
                    case "status":
                        return incident.getStatusId();
                    default:
                        return ""; 
                }
            }, Collectors.counting()));
        
        // Transform the grouped incidents into the desired report format
        AtomicInteger idGenerator = new AtomicInteger(1);
        
        // Transform the grouped incidents into the desired report format with unique IDs
        List<Report> reports = groupedIncidents.entrySet().stream()
            .map(entry -> new Report(idGenerator.getAndIncrement(), entry.getKey(), entry.getValue().intValue()))
            .collect(Collectors.toList());
        
        return reports;        
    }
}
