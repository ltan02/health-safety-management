package com.teamadc.backend.controller;

import com.teamadc.backend.model.Report;
import com.teamadc.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
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

}
