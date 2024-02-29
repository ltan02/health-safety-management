package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Column;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ColumnRepositoryImpl extends AbstractFirestoreRepository<Column> implements GenericRepository<Column> {
    public ColumnRepositoryImpl() {
        super(Column.class);
    }

    @Override
    protected String getCollectionName() {
        return "columns";
    }
}
