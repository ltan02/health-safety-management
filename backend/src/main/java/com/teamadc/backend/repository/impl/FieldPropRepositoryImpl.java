package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.FieldProp;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class FieldPropRepositoryImpl extends AbstractFirestoreRepository<FieldProp> implements GenericRepository<FieldProp> {
    public FieldPropRepositoryImpl() {
        super(FieldProp.class);
    }

    @Override
    protected String getCollectionName() {
        return "fieldProps";
    }
}
