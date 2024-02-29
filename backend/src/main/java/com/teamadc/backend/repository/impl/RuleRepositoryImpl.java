package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Rule;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class RuleRepositoryImpl extends AbstractFirestoreRepository<Rule> implements GenericRepository<Rule> {
    public RuleRepositoryImpl() {
        super(Rule.class);
    }

    @Override
    protected String getCollectionName() {
        return "rules";
    }
}
