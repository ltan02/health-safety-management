package com.teamadc.backend.controller;

import com.teamadc.backend.model.*;
import com.teamadc.backend.service.IncidentService;
import com.teamadc.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;
    private final IncidentService incidentService;

    @Autowired
    public ReportController(ReportService reportService, IncidentService incidentService) {
        this.reportService = reportService;
        this.incidentService = incidentService;
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<Report>> getReportByDate(@PathVariable String type, @RequestParam Optional<String> start, @RequestParam Optional<String> end) {
        try {
            List<Report> reports = reportService.getReports(type, start, end);
            return ResponseEntity.ok(reports);
        } catch (InterruptedException | ExecutionException e ) {
            return ResponseEntity.internalServerError().build();
        } catch (ParseException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/category-analysis")
    public ResponseEntity<List<CategoryAnalysis>> getCategoryAnalysis(@RequestParam Optional<String> start, @RequestParam String end) {
        LocalDate startDate = start.map(s -> Instant.parse(s).atZone(ZoneId.systemDefault()).toLocalDate())
                .orElseGet(() -> incidentService.findEarliestIncidentDate().toInstant()
                        .atZone(ZoneId.systemDefault()).toLocalDate());
        LocalDate endDate = Instant.parse(end).atZone(ZoneId.systemDefault()).toLocalDate();

        List<Incident> incidents = incidentService.findIncidentsBetween(Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));

        Map<String, List<Incident>> incidentsByCategory = incidents.stream()
                .collect(Collectors.groupingBy(Incident::getIncidentCategory));

        List<CategoryAnalysis> categoryAnalyses = incidentsByCategory.entrySet().stream()
                .map(entry -> {
                    String categoryName = entry.getKey();
                    List<Incident> categoryIncidents = entry.getValue();

                    // Calculate total incidents in this category
                    int totalIncidents = categoryIncidents.size();

                    // Further break down by status, if desired
                    Map<String, Long> statusCount = categoryIncidents.stream()
                            .collect(Collectors.groupingBy(Incident::getStatusId, Collectors.counting()));

                    List<StatusCategoryCount> statusCategoryCounts = statusCount.entrySet().stream()
                            .map(statusEntry -> new StatusCategoryCount(statusEntry.getKey(), statusEntry.getValue().intValue()))
                            .collect(Collectors.toList());

                    return new CategoryAnalysis(categoryName, totalIncidents, statusCategoryCounts);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(categoryAnalyses);
    }

    @GetMapping("/employee-involvement")
    public ResponseEntity<List<EmployeeInvolvement>> getEmployeeInvolvement(@RequestParam Optional<String> start, @RequestParam String end) {
        LocalDate startDate = start.map(s -> Instant.parse(s).atZone(ZoneId.systemDefault()).toLocalDate())
                .orElseGet(() -> incidentService.findEarliestIncidentDate().toInstant()
                        .atZone(ZoneId.systemDefault()).toLocalDate());
        LocalDate endDate = Instant.parse(end).atZone(ZoneId.systemDefault()).toLocalDate();

        List<Incident> incidents = incidentService.findIncidentsBetween(Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));

        // Group incidents by reporter
        Map<String, Long> incidentsReported = incidents.stream()
                .collect(Collectors.groupingBy(Incident::getReporter, Collectors.counting()));

        // Get a flat list of all employee involvements
        Map<String, Long> incidentsInvolved = incidents.stream()
                .flatMap(incident -> incident.getEmployeesInvolved().stream())
                .collect(Collectors.groupingBy(employeeId -> employeeId, Collectors.counting()));

        // Combine the two maps above to create EmployeeInvolvement objects
        Set<String> allEmployeeIds = new HashSet<>();
        allEmployeeIds.addAll(incidentsReported.keySet());
        allEmployeeIds.addAll(incidentsInvolved.keySet());

        List<EmployeeInvolvement> employeeInvolvements = allEmployeeIds.stream()
                .map(employeeId -> new EmployeeInvolvement(
                        employeeId,
                        incidentsReported.getOrDefault(employeeId, 0L).intValue() + incidentsInvolved.getOrDefault(employeeId, 0L).intValue(),
                        incidentsReported.getOrDefault(employeeId, 0L).intValue(),
                        incidentsInvolved.getOrDefault(employeeId, 0L).intValue()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(employeeInvolvements);
    }

    @GetMapping("/status-insights")
    public ResponseEntity<List<StatusInsight>> getStatusInsights(
            @RequestParam Optional<String> start,
            @RequestParam String end) {

        LocalDate startDate = start.map(s -> Instant.parse(s).atZone(ZoneId.systemDefault()).toLocalDate())
                .orElseGet(() -> incidentService.findEarliestIncidentDate().toInstant()
                        .atZone(ZoneId.systemDefault()).toLocalDate());
        LocalDate endDate = Instant.parse(end).atZone(ZoneId.systemDefault()).toLocalDate();

        List<Incident> incidents = incidentService.findIncidentsBetween(Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant()));

        // Prepare a map to hold cumulative counts
        Map<String, Long> cumulativeStatusCounts = new HashMap<>();
        List<StatusInsight> insights = new ArrayList<>();

        // Sort incidents by date
        incidents.sort(Comparator.comparing(i -> i.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()));

        // For each day in the range, accumulate incidents
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            final LocalDate finalDate = date;
            // Filter incidents up to and including this date
            List<Incident> filteredIncidents = incidents.stream()
                    .filter(i -> !i.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().isAfter(finalDate))
                    .toList();

            // Update cumulative counts
            Map<String, Long> dailyStatusCounts = filteredIncidents.stream()
                    .collect(Collectors.groupingBy(Incident::getStatusId, Collectors.counting()));

            dailyStatusCounts.forEach((status, count) -> cumulativeStatusCounts.merge(status, count, Long::sum));

            // Calculate and add insights for this day
            long dailyTotal = cumulativeStatusCounts.values().stream().mapToLong(Long::longValue).sum();
            LocalDate finalDate1 = date;
            cumulativeStatusCounts.forEach((statusId, count) -> {
                double percentage = 100.0 * count / dailyTotal;
                insights.add(new StatusInsight(statusId, percentage, Date.from(finalDate1.atStartOfDay(ZoneId.systemDefault()).toInstant())));
            });
        }

        return ResponseEntity.ok(insights);
    }

}
