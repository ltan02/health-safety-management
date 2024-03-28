package com.teamadc.backend.service;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.teamadc.backend.model.Graph;
import com.teamadc.backend.model.ReportBoard;
import com.teamadc.backend.repository.GenericRepository;

@Service
public class ReportBoardService {
    private final GenericRepository<ReportBoard> reportBoardRepository;

    @Autowired
    public ReportBoardService(GenericRepository<ReportBoard> reportBoardRepository) {
        this.reportBoardRepository = reportBoardRepository;
    }

    public ReportBoard createBoard(ReportBoard reportBoard) throws InterruptedException, ExecutionException {
        return reportBoardRepository.save(reportBoard);
    }

    public ReportBoard updateBoard(String id, List<Graph> newGraphs) throws InterruptedException, ExecutionException {
        ReportBoard reportBoard = reportBoardRepository.findById(id);
        reportBoard.setGraphs(newGraphs);

        return reportBoardRepository.save(reportBoard);
    }

    public ReportBoard getBoardByUserId(String userId) throws InterruptedException, ExecutionException {
        List<ReportBoard> boards = reportBoardRepository.findAll();
        return boards.stream()
                 .filter(board -> board.getUserId().equals(userId))
                 .findFirst()
                 .orElse(null);
    }
}
