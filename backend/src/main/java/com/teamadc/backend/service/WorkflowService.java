package com.teamadc.backend.service;

import com.teamadc.backend.model.Workflow;
import com.teamadc.backend.model.Coordinate;
import com.teamadc.backend.model.State;
import com.teamadc.backend.model.Transition;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class WorkflowService {
    private final GenericRepository<Workflow> workflowRepository;
    private final GenericRepository<State> stateRepository;
    private final GenericRepository<Transition> transitionRepository;

    @Autowired
    public WorkflowService(GenericRepository<Workflow> workflowRepository, GenericRepository<State> stateRepository, GenericRepository<Transition> transitionRepository) {
        this.workflowRepository = workflowRepository;
        this.stateRepository = stateRepository;
        this.transitionRepository = transitionRepository;
    }

    public Workflow createOrUpdateWorkflow(Workflow workflow) throws InterruptedException, ExecutionException {
        workflow.setTransitions(List.of());
        workflow.setStates(List.of());
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

    public void addState(String workflowId, State state ) throws InterruptedException, ExecutionException {
        Workflow workflow = workflowRepository.findById(workflowId);
        List<State> states = workflow.getStates();
        stateRepository.save(state);
        states.add(state);
        workflow.setStates(states);
        workflowRepository.save(workflow);
    }

    public void deleteState(String workflowId, String stateId) throws InterruptedException, ExecutionException {
        Workflow workflow = workflowRepository.findById(workflowId);
        List<State> states = workflow.getStates();
        stateRepository.deleteById(stateId);
        states.removeIf(state -> state.getId().equals(stateId));
        workflow.setStates(states);
        workflowRepository.save(workflow);
    }

    public void addTransition(String workflowId, Transition transition) throws InterruptedException, ExecutionException {
        Workflow workflow = workflowRepository.findById(workflowId);
        List<Transition> flows = workflow.getTransitions();
        transitionRepository.save(transition);
        flows.add(transition);
        workflow.setTransitions(flows);
        workflowRepository.save(workflow);
    }

    public void deleteTransition(String workflowId, String flowId) throws InterruptedException, ExecutionException {
        Workflow workflow = workflowRepository.findById(workflowId);
        List<Transition> flows = workflow.getTransitions();
        transitionRepository.deleteById(flowId);
        flows.removeIf(f -> f.getId().equals(flowId));
        workflow.setTransitions(flows);
        workflowRepository.save(workflow);
    }

    public void updateCoordinate(String workflowId, String stateId, Coordinate coordinate) throws InterruptedException, ExecutionException {
        Workflow workflow = workflowRepository.findById(workflowId);
        List<State> states = workflow.getStates();
        State state = states.stream().filter(s -> s.getId().equals(stateId)).findFirst().orElseThrow();
        state.setCoordinate(coordinate);
        states.removeIf(s -> s.getId().equals(stateId));
        stateRepository.save(state);
        states.add(state);
        workflow.setStates(states);
        workflowRepository.save(workflow);
    }
    
}
