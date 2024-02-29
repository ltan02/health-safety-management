package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Board;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class BoardRepositoryImpl extends AbstractFirestoreRepository<Board> implements GenericRepository<Board> {
    public BoardRepositoryImpl() {
        super(Board.class);
    }

    @Override
    protected String getCollectionName() {
        return "boards";
    }
}
