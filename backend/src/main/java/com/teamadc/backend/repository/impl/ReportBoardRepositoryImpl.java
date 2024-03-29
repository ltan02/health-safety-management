package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.ReportBoard;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ReportBoardRepositoryImpl extends AbstractFirestoreRepository<ReportBoard> implements GenericRepository<ReportBoard> {
    public ReportBoardRepositoryImpl() {
        super(ReportBoard.class);
    }

    @Override
    protected String getCollectionName() {
        return "reportBoards";
    }
}
