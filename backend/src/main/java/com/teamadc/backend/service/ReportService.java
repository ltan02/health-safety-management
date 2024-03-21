package com.teamadc.backend.service;

import com.teamadc.backend.model.Report;
import com.teamadc.backend.model.Status;
import com.teamadc.backend.model.User;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.repository.GenericRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final GenericRepository<Incident> incidentRepository;
    private final GenericRepository<Status> statusRepository;
    private final GenericRepository<User> userRepository;

    @Autowired
    public ReportService(GenericRepository<Incident> incidentRepository, GenericRepository<Status> statusRepository, GenericRepository<User> userRepository) {
        this.incidentRepository = incidentRepository;
        this.statusRepository = statusRepository;
        this.userRepository = userRepository;
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
        
        AtomicInteger idGenerator = new AtomicInteger(1);
        
        List<Report> reports = groupedIncidents.entrySet().stream()
            .map(entry -> {
                try {
                    String key = entry.getKey();
                    int count = entry.getValue().intValue();
                    if(type.equals("status")) {
                        String statusName = statusRepository.findById(key).getName();
                        return new Report(idGenerator.getAndIncrement(), statusName, count);
                    } else if (type.equals("reporter")) {
                        String reporterName = userRepository.findById(key).getFirstName() + " " + userRepository.findById(key).getLastName();
                        return new Report(idGenerator.getAndIncrement(), reporterName, count);
                    } else {
                        return new Report(idGenerator.getAndIncrement(), key, count);
                    }
                } catch (InterruptedException | ExecutionException e) {
                    return null;
                }})
            .collect(Collectors.toList());
        return reports;        
    }

    public List<Report> getReports(String type, Date start, Date end) throws InterruptedException, ExecutionException {
        List<Incident> incidents = incidentRepository.findAll();
        List<Incident> filteredIncidents = incidents.stream()
        .filter(incident -> !incident.getCreatedAt().before(start) && !incident.getCreatedAt().after(end))
        .collect(Collectors.toList());
        Map<String, Long> groupedIncidents = filteredIncidents.stream()
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
        

        AtomicInteger idGenerator = new AtomicInteger(1);
        

        List<Report> reports = groupedIncidents.entrySet().stream()
            .map(entry -> {
                try {
                    String key = entry.getKey();
                    int count = entry.getValue().intValue();
                    if(type.equals("status")) {
                        String statusName = statusRepository.findById(key).getName();
                        return new Report(idGenerator.getAndIncrement(), statusName, count);
                    } else if (type.equals("reporter")) {
                        String reporterName = userRepository.findById(key).getFirstName() + " " + userRepository.findById(key).getLastName();
                        return new Report(idGenerator.getAndIncrement(), reporterName, count);
                    } else {
                        return new Report(idGenerator.getAndIncrement(), key, count);
                    }
                } catch (InterruptedException | ExecutionException e) {
                    return null;
                }})
            .collect(Collectors.toList());
        return reports;        
    }
}
