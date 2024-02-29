package com.teamadc.backend.controller;

import com.teamadc.backend.model.Board;
import com.teamadc.backend.model.Incident;
import com.teamadc.backend.service.BoardService;
import com.teamadc.backend.service.IncidentService;
import com.teamadc.backend.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/boards")
public class BoardController {

    private final BoardService boardService;
    private final IncidentService incidentService;
    private final StatusService statusService;

    @Autowired
    public BoardController(BoardService boardService, IncidentService incidentService, StatusService statusService) {
        this.boardService = boardService;
        this.incidentService = incidentService;
        this.statusService = statusService;
    }

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board req) {
        Board board = new Board(null, req.getName(), req.isActive(), req.getAdminColumnIds(), req.getEmployeeColumnIds(), req.getStatusIds(), req.getWorkflowId());
        try {
            Board newBoard = boardService.createOrUpdateBoard(board);
            return ResponseEntity.ok(newBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Board>> getBoards() {
        try {
            List<Board> boards = boardService.getBoards();
            return ResponseEntity.ok(boards);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<Board> getBoardById(@PathVariable String boardId) {
        try {
            Board board = boardService.getBoardById(boardId);
            return ResponseEntity.ok(board);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBoard(@PathVariable String boardId) {
        try {
            boardService.deleteBoard(boardId);
            return ResponseEntity.ok().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{boardId}")
    public ResponseEntity<Board> updateBoard(@PathVariable String boardId, @RequestBody Board req) {
        try {
            Board existingBoard = boardService.getBoardById(boardId);
            if (existingBoard == null) {
                return ResponseEntity.notFound().build();
            }

            if (req.getName() != null) existingBoard.setName(req.getName());
            existingBoard.setActive(req.isActive());
            if (req.getAdminColumnIds() != null) existingBoard.setAdminColumnIds(req.getAdminColumnIds());
            if (req.getEmployeeColumnIds() != null) existingBoard.setEmployeeColumnIds(req.getEmployeeColumnIds());
            if (req.getWorkflowId() != null) existingBoard.setWorkflowId(req.getWorkflowId());

            Board updatedBoard = boardService.createOrUpdateBoard(existingBoard);
            return ResponseEntity.ok(updatedBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
