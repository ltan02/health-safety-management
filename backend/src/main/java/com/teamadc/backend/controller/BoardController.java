package com.teamadc.backend.controller;

import com.teamadc.backend.dto.request.CreateColumnRequest;
import com.teamadc.backend.dto.request.UpdateStatusRequest;
import com.teamadc.backend.model.Board;
import com.teamadc.backend.model.Column;
import com.teamadc.backend.model.Status;
import com.teamadc.backend.service.BoardService;
import com.teamadc.backend.service.ColumnService;
import com.teamadc.backend.service.IncidentService;
import com.teamadc.backend.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/boards")
public class BoardController {

    private final BoardService boardService;
    private final StatusService statusService;
    private final ColumnService columnService;

    @Autowired
    public BoardController(BoardService boardService, StatusService statusService, ColumnService columnService) {
        this.boardService = boardService;
        this.statusService = statusService;
        this.columnService = columnService;
    }

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board req) {
        Board board = new Board(null, req.getName(), req.isActive(), req.getAdminColumnIds(), req.getEmployeeColumnIds(), req.getStatusIds(), req.getWorkflowIds());
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
            if (req.getAdminColumnIds() != null) existingBoard.setAdminColumnIds(req.getAdminColumnIds());
            if (req.getEmployeeColumnIds() != null) existingBoard.setEmployeeColumnIds(req.getEmployeeColumnIds());
            if (req.getStatusIds() != null) existingBoard.setStatusIds(req.getStatusIds());
            if (req.getWorkflowIds() != null) existingBoard.setWorkflowIds(req.getWorkflowIds());

            Board updatedBoard = boardService.createOrUpdateBoard(existingBoard);
            return ResponseEntity.ok(updatedBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{boardId}/status/{statusId}")
    public ResponseEntity<Board> removeStatus(@PathVariable String boardId, @PathVariable String statusId) {
        try {
            Board existingBoard = boardService.getBoardById(boardId);
            if (existingBoard == null) {
                return ResponseEntity.notFound().build();
            }

            if (!existingBoard.getStatusIds().contains(statusId)) {
                return ResponseEntity.ok(existingBoard);
            }

            List<String> statusIds = existingBoard.getStatusIds();
            statusIds.remove(statusId);
            existingBoard.setStatusIds(statusIds);

            boardService.createOrUpdateBoard(existingBoard);

            return ResponseEntity.ok(existingBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{boardId}/status/{statusId}")
    public ResponseEntity<Board> addStatus(@PathVariable String boardId, @PathVariable String statusId) {
        try {
            Board existingBoard = boardService.getBoardById(boardId);
            if (existingBoard == null) {
                return ResponseEntity.notFound().build();
            }

            Status status = statusService.getStatusById(statusId);
            if (status == null) {
                return ResponseEntity.notFound().build();
            }

            if (existingBoard.getStatusIds().contains(statusId)) {
                return ResponseEntity.ok(existingBoard);
            }

            List<String> statusIds = existingBoard.getStatusIds();
            statusIds.add(statusId);
            existingBoard.setStatusIds(statusIds);

            boardService.createOrUpdateBoard(existingBoard);

            return ResponseEntity.ok(existingBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{boardId}/status/{statusId}")
    public ResponseEntity<Board> updateStatus(@PathVariable String boardId, @PathVariable String statusId, @RequestBody UpdateStatusRequest req) {
        try {
            Board existingBoard = boardService.getBoardById(boardId);
            if (existingBoard == null) {
                return ResponseEntity.notFound().build();
            }

            Status status = statusService.getStatusById(statusId);
            if (status == null) {
                return ResponseEntity.notFound().build();
            }

            String toColumnId = req.getToColumnId();
            if (toColumnId == null) {
                return ResponseEntity.badRequest().build();
            }

            Column currentColumn = null;
            Column toColumn = null;

            List<String> columnIds = req.getType().equals("ADMIN") ? existingBoard.getAdminColumnIds() : existingBoard.getEmployeeColumnIds();

            List<Column> columns = columnIds.stream().map(columnId -> {
                try {
                    return columnService.getColumnById(columnId);
                } catch (InterruptedException | ExecutionException e) {
                    return null;
                }
            }).toList();

            for (Column column : columns) {
                if (column.getId().equals(toColumnId)) {
                    if (column.getStatusIds().contains(statusId)) {
                        return ResponseEntity.ok(existingBoard);
                    }
                }
            }

            if (req.getToColumnId().equals("UNASSIGNED")) {
                for (Column column : columns) {
                    if (column.getStatusIds().contains(statusId)) {
                        column.getStatusIds().remove(statusId);
                        columnService.createOrUpdateColumn(column);
                    }
                }
                return ResponseEntity.ok(existingBoard);
            }

            for (Column column : columns) {
                if (column.getStatusIds().contains(statusId)) {
                    currentColumn = column;
                }
                if (column.getId().equals(toColumnId)) {
                    toColumn = column;
                }
            }

            if (toColumn == null) {
                return ResponseEntity.notFound().build();
            }

            if (currentColumn != null && !currentColumn.getId().equals(toColumnId)) {
                currentColumn.getStatusIds().remove(statusId);
                columnService.createOrUpdateColumn(currentColumn);
            }

            toColumn.getStatusIds().add(statusId);
            columnService.createOrUpdateColumn(toColumn);

            return ResponseEntity.ok(existingBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{boardId}/columns/{columnId}")
    public ResponseEntity<Board> addColumn(@PathVariable String boardId, @PathVariable String columnId, @RequestBody CreateColumnRequest req) {
        try {
            Board existingBoard = boardService.getBoardById(boardId);
            if (existingBoard == null) {
                return ResponseEntity.notFound().build();
            }

            Column column = columnService.getColumnById(columnId);
            if (column == null) {
                return ResponseEntity.notFound().build();
            }

            List<String> columnIds = req.getBoardType().equals("ADMIN") ? existingBoard.getAdminColumnIds() : existingBoard.getEmployeeColumnIds();
            if (columnIds.contains(columnId)) {
                return ResponseEntity.ok(existingBoard);
            }

            if (req.getBoardType().equals("ADMIN")) {
                List<String> adminColumnIds = existingBoard.getAdminColumnIds();
                adminColumnIds.add(columnId);
                existingBoard.setAdminColumnIds(adminColumnIds);
            } else {
                List<String> employeeColumnIds = existingBoard.getEmployeeColumnIds();
                employeeColumnIds.add(columnId);
                existingBoard.setEmployeeColumnIds(employeeColumnIds);
            }

            boardService.createOrUpdateBoard(existingBoard);

            return ResponseEntity.ok(existingBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{boardId}/columns/{columnId}")
    public ResponseEntity<Board> removeColumn(@PathVariable String boardId, @PathVariable String columnId, @RequestBody CreateColumnRequest req) {
        try {
            Board existingBoard = boardService.getBoardById(boardId);
            if (existingBoard == null) {
                return ResponseEntity.notFound().build();
            }

            List<String> columnIds = req.getBoardType().equals("ADMIN") ? existingBoard.getAdminColumnIds() : existingBoard.getEmployeeColumnIds();
            if (!columnIds.contains(columnId)) {
                return ResponseEntity.ok(existingBoard);
            }

            if (req.getBoardType().equals("ADMIN")) {
                List<String> adminColumnIds = existingBoard.getAdminColumnIds();
                adminColumnIds.remove(columnId);
                existingBoard.setAdminColumnIds(adminColumnIds);
            } else {
                List<String> employeeColumnIds = existingBoard.getEmployeeColumnIds();
                employeeColumnIds.remove(columnId);
                existingBoard.setEmployeeColumnIds(employeeColumnIds);
            }

            boardService.createOrUpdateBoard(existingBoard);

            return ResponseEntity.ok(existingBoard);
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
