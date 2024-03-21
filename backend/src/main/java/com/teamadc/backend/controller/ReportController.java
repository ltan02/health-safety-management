package com.teamadc.backend.controller;

import com.teamadc.backend.model.Report;
import com.teamadc.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.Date;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/{type}")
    public ResponseEntity<List<Report>> getReport(@PathVariable String type) {
        try {
            List<Report> reports = reportService.getReports(type);
            return ResponseEntity.ok(reports);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{type}/{start}/{end}")
    public ResponseEntity<List<Report>> getReportByDate(@PathVariable String type, @PathVariable String start, @PathVariable String end) {
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
            Date startDate = formatter.parse(start);
            Date endDate = formatter.parse(end);
            List<Report> reports = reportService.getReports(type, startDate, endDate);
            return ResponseEntity.ok(reports);
        } catch (InterruptedException | ExecutionException e ) {
            return ResponseEntity.internalServerError().build();
        } catch (ParseException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
