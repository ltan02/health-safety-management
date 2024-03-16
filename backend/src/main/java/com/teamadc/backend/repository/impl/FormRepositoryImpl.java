package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Form;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class FormRepositoryImpl extends AbstractFirestoreRepository<Form> implements GenericRepository<Form> {
    public FormRepositoryImpl() {
        super(Form.class);
    }

    @Override
    protected String getCollectionName() {
        return "forms";
    }
}
