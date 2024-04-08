package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Mail;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class MailRepositoryImpl extends AbstractFirestoreRepository<Mail> implements GenericRepository<Mail> {
    public MailRepositoryImpl() {
        super(Mail.class);
    }

    @Override
    protected String getCollectionName() {
        return "mail";
    }
}
