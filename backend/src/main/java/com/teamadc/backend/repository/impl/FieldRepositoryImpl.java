package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Field;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class FieldRepositoryImpl extends AbstractFirestoreRepository<Field> implements GenericRepository<Field> {
    public FieldRepositoryImpl() {
        super(Field.class);
    }

    @Override
    protected String getCollectionName() {
        return "fields";
    }
}
