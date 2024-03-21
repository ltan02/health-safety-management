package com.teamadc.backend.service;

import com.teamadc.backend.model.Status;
import com.teamadc.backend.model.Transition;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class TransitionService {
    private final GenericRepository<Transition> transitionRepository;

    @Autowired
    public TransitionService(GenericRepository<Transition> transitionRepository) {
        this.transitionRepository = transitionRepository;
    }

    public Transition createOrUpdateTransition(Transition transition) throws InterruptedException, ExecutionException {
        return transitionRepository.save(transition);
    }

    public void deleteTransition(String transitionId) throws InterruptedException, ExecutionException {
        transitionRepository.deleteById(transitionId);
    }

    public Transition getTransitionById(String transitionId) throws InterruptedException, ExecutionException {
        return transitionRepository.findById(transitionId);
    }

    public List<Transition> getTransitions() throws InterruptedException, ExecutionException {
        return transitionRepository.findAll();
    }
}
