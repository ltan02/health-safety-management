package com.teamadc.backend.service;

import com.teamadc.backend.dto.request.CustomFieldRequest;
import com.teamadc.backend.dto.response.EnhancedIncidentResponse;
import com.teamadc.backend.model.*;
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
    private final BoardService boardService;
    private final ColumnService columnService;
    private final UserService userService;
    private static final SimpleDateFormat dateTimeFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");

    @Autowired
    public IncidentService(GenericRepository<Incident> incidentRepository, BoardService boardService, ColumnService columnService, UserService userService) {
        this.incidentRepository = incidentRepository;
        this.boardService = boardService;
        this.columnService = columnService;
        this.userService = userService;
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

        return allIncidents.stream()
                .filter(incident -> {
                    Date incidentDate = incident.getCreatedAt();
                    if (start == null) {
                        return (end == null) || !incidentDate.after(end);
                    }
                    // If start is not null but end is, only check that the incident is on or after start
                    if (end == null) {
                        return !incidentDate.before(start);
                    }
                    // If both start and end are not null, check that the incident is within the range
                    return !incidentDate.before(start) && !incidentDate.after(end);
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

    private EnhancedIncidentResponse mapToEnhancedIncidentResponse(Incident incident) {
        User reporter = null;
        User reviewer = null;
        List<User> employeesInvolved = new ArrayList<>();

        try {
            if (incident.getReporter() != null && !incident.getReporter().trim().isEmpty()) {
                reporter = userService.getUserById(incident.getReporter());
            }
        } catch (ExecutionException | InterruptedException e) {
            System.err.println("Error fetching reporter: " + e.getMessage());
        }

        try {
            // Only attempt to fetch the reviewer if the ID is not null and not empty
            if (incident.getReviewer() != null && !incident.getReviewer().trim().isEmpty()) {
                reviewer = userService.getUserById(incident.getReviewer());
            }
        } catch (ExecutionException | InterruptedException e) {
            System.err.println("Error fetching reviewer: " + e.getMessage());
        }

        for (String userId : incident.getEmployeesInvolved()) {
            try {
                if (userId != null && !userId.trim().isEmpty()) {
                    User employee = userService.getUserById(userId);
                    if (employee != null) { // Additional null check in case the user service returns null for a valid ID
                        employeesInvolved.add(employee);
                    }
                }
            } catch (ExecutionException | InterruptedException e) {
                System.err.println("Error fetching employee involved: " + e.getMessage());
            }
        }

        return new EnhancedIncidentResponse(
                incident.getId(),
                incident.getIncidentDate(),
                incident.getIncidentCategory(),
                reporter,
                employeesInvolved,
                incident.getStatusId(),
                reviewer,
                incident.getComments(),
                incident.getCreatedAt(),
                incident.getLastUpdatedAt(),
                incident.getCustomFields(),
                incident.getStatusHistory()
        );
    }

    public Map<String, List<EnhancedIncidentResponse>> getPaginatedIncidentsForBoardColumns(String boardId, int page, int pageSize) throws InterruptedException, ExecutionException {
        Board board = boardService.getBoardById(boardId);
        Map<String, List<EnhancedIncidentResponse>> paginatedIncidentsByColumn = new HashMap<>();

        for (String columnId : board.getAdminColumnIds()) { // Use adminColumnIds or adjust based on your logic
            Column column = columnService.getColumnById(columnId);
            for (String statusId : column.getStatusIds()) {
                Map<String, Object> filters = new HashMap<>();
                filters.put("statusId", statusId);

                int offset = page * pageSize;
                Optional<List<Incident>> incidents = incidentRepository.findAll(filters, offset, pageSize);
                List<EnhancedIncidentResponse> responses = incidents.orElse(new ArrayList<>()).stream()
                        .map(this::mapToEnhancedIncidentResponse)
                        .collect(Collectors.toList());

                if (!responses.isEmpty()) {
                    paginatedIncidentsByColumn.put(column.getId(), responses);
                }
            }
        }

        return paginatedIncidentsByColumn;
    }
}
