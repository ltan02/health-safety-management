package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Invitation;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class InvitationRepositoryImpl extends AbstractFirestoreRepository<Invitation> implements GenericRepository<Invitation> {

    public InvitationRepositoryImpl() {
        super(Invitation.class);
    }

    @Override
    protected String getCollectionName() {
        return "invitations";
    }
}
