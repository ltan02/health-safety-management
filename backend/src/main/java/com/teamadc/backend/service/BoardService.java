package com.teamadc.backend.service;

import com.teamadc.backend.model.Board;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class BoardService {

    private final GenericRepository<Board> boardRepository;

    @Autowired
    public BoardService(GenericRepository<Board> boardRepository) {
        this.boardRepository = boardRepository;
    }

    public Board createOrUpdateBoard(Board board) throws InterruptedException, ExecutionException {
        return boardRepository.save(board);
    }

    public void deleteBoard(String boardId) throws InterruptedException, ExecutionException {
        boardRepository.deleteById(boardId);
    }

    public Board getBoardById(String boardId) throws InterruptedException, ExecutionException {
        return boardRepository.findById(boardId);
    }

    public List<Board> getBoards() throws InterruptedException, ExecutionException {
        return boardRepository.findAll();
    }

}
