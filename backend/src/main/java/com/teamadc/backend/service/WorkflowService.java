package com.teamadc.backend.service;

import com.teamadc.backend.model.Workflow;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class WorkflowService {

    private final GenericRepository<Workflow> workflowRepository;

    @Autowired
    public WorkflowService(GenericRepository<Workflow> workflowRepository) {
        this.workflowRepository = workflowRepository;
    }

    public Workflow createOrUpdateWorkflow(Workflow workflow) throws InterruptedException, ExecutionException {
        return workflowRepository.save(workflow);
    }

    public void deleteWorkflow(String workflowId) throws InterruptedException, ExecutionException {
        workflowRepository.deleteById(workflowId);
    }

    public Workflow getWorkflowById(String workflowId) throws InterruptedException, ExecutionException {
        return workflowRepository.findById(workflowId);
    }

    public List<Workflow> getWorkflows() throws InterruptedException, ExecutionException {
        return workflowRepository.findAll();
    }
}
