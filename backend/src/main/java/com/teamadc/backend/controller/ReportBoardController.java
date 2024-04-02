package com.teamadc.backend.controller;

import java.util.concurrent.ExecutionException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.teamadc.backend.model.Graph;
import com.teamadc.backend.model.ReportBoard;

import com.teamadc.backend.service.ReportBoardService;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/dashboard")
public class ReportBoardController {
    @Autowired
    private final ReportBoardService reportBoardService;

    public ReportBoardController(ReportBoardService reportBoardService) {
        this.reportBoardService = reportBoardService;
    }

    @PostMapping("/{reportBoardId}")
    public ResponseEntity<ReportBoard> updateBoard(@PathVariable String reportBoardId, @RequestBody List<Graph> request) {
        try {
            ReportBoard newReportBoard = reportBoardService.updateBoard(reportBoardId, request);
            return ResponseEntity.ok(newReportBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{userId}")
    public  ResponseEntity<ReportBoard> getBoardByUserId(@PathVariable String userId) {
        try {
            ReportBoard reportBoard = reportBoardService.getBoardByUserId(userId);
            if(reportBoard == null) reportBoard = reportBoardService.createBoard(new ReportBoard(null, userId));
            return ResponseEntity.ok(reportBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
