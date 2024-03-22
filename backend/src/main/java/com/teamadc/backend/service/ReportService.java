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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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


    public List<Report> getReports(String type, Optional<String> start, Optional<String> end) throws InterruptedException, ExecutionException, ParseException {
           
        List<Incident> incidents = incidentRepository.findAll();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
        List<Incident> filteredIncidents;
        if(start.isPresent() && end.isPresent()) {
            Date startDate = formatter.parse(start.get());
            Date endDate = formatter.parse(end.get());
            filteredIncidents = incidents.stream()
                .filter(incident -> !incident.getCreatedAt().before(startDate) && !incident.getCreatedAt().after(endDate))
                .collect(Collectors.toList());
        } else if (start.isPresent() && !end.isPresent()) {
            Date startDate = formatter.parse(start.get());
            filteredIncidents = incidents.stream()
                .filter(incident -> !incident.getCreatedAt().before(startDate))
                .collect(Collectors.toList());
        } else if (!start.isPresent() && end.isPresent()) {
            Date endDate = formatter.parse(end.get());
            filteredIncidents = incidents.stream()
                .filter(incident -> !incident.getCreatedAt().after(endDate))
                .collect(Collectors.toList());
        } else {
            filteredIncidents = incidents;
        }

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
