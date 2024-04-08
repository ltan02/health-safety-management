package com.teamadc.backend.service;

import com.teamadc.backend.model.Group;
import com.teamadc.backend.model.Invitation;
import com.teamadc.backend.model.Mail;
import com.teamadc.backend.model.MailContent;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class InvitationService {
    private final GenericRepository<Mail> mailRepository;
    private final GenericRepository<Invitation> invitationRepository;

    @Autowired
    public InvitationService(GenericRepository<Mail> mailRepository, GenericRepository<Invitation> invitationRepository) {
        this.mailRepository = mailRepository;
        this.invitationRepository = invitationRepository;
    }

    public Invitation createOrUpdateInvitation(Invitation invitation) throws InterruptedException, ExecutionException {
        Invitation savedInvitation = invitationRepository.save(invitation);
        Mail mail = new Mail(invitation.getEmail(), new MailContent("Invitation to join Team APC's Incident Management System", String.format("You have been invited as %s. Please follow this link to sign up.", invitation.getRole()), String.format("You have been invited as <strong>${role}</strong>. Please <a href=\"https://yourdomain.com/signup?invitationId=%s\">follow this link</a> to sign up.", savedInvitation.getId())));
        mailRepository.save(mail);
        return savedInvitation;
    }

    public Invitation getInvitationById(String invitationId) throws InterruptedException, ExecutionException {
        return invitationRepository.findById(invitationId);
    }


}
