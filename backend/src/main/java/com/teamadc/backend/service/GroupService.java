package com.teamadc.backend.service;


import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;

import com.teamadc.backend.enums.Role;
import com.teamadc.backend.model.Group;
import com.teamadc.backend.repository.GenericRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service

public class GroupService{

    private final GenericRepository<Group> userRepository;

    @Autowired
    public GroupService(GenericRepository<Group> userRepository) {
        this.userRepository = userRepository;
    }

    public Group createOrUpdateGroup(Group group) throws InterruptedException, ExecutionException {
        List<String> members = group.getMembers();
        if (members == null) {
            members = List.of();
        }
        group.setMembers(members);
    
        return userRepository.save(group);
    }

    public Group updateGroup(Group group) throws InterruptedException, ExecutionException {
        return userRepository.save(group);
    }

    public void deleteGroup(String groupId) throws InterruptedException, ExecutionException {
        userRepository.deleteById(groupId);
    }

    public Group getGroupById(String groupId) throws InterruptedException, ExecutionException {
        return userRepository.findById(groupId);
    }

    public List<Group> getGroups() throws InterruptedException, ExecutionException {
        return userRepository.findAll();
    }

    public List<String> getMembers(String groupId) throws InterruptedException, ExecutionException {
        return userRepository.findById(groupId).getMembers();
    }

    public Group addMember(String groupId, String memberId) throws InterruptedException, ExecutionException {
        Group group = userRepository.findById(groupId);
        List<String> members = group.getMembers();
        members.add(memberId);
        group.setMembers(members);
        return userRepository.save(group);
    }

    public Group removeMember(String groupId, String memberId) throws InterruptedException, ExecutionException {
        Group group = userRepository.findById(groupId);
        List<String> members = group.getMembers();
        members.remove(memberId);
        group.setMembers(members);
        return userRepository.save(group);
    }

    public Group addMembers(String groupId, List<String> memberIds) throws InterruptedException, ExecutionException {
        Group group = userRepository.findById(groupId);
        List<String> members = group.getMembers();
        members.addAll(memberIds);
        group.setMembers(members);
        return userRepository.save(group);
    }

    public Group removeMembers(String groupId, List<String> memberIds) throws InterruptedException, ExecutionException {
        Group group = userRepository.findById(groupId);
        List<String> members = group.getMembers();
        members.removeAll(memberIds);
        group.setMembers(members);
        return userRepository.save(group);
    }

    public Group updateMembers(String groupId, List<String> memberIds) throws InterruptedException, ExecutionException {
        Group group = userRepository.findById(groupId);
        group.setMembers(memberIds);
        return userRepository.save(group);
    }


}
