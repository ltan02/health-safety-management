package com.teamadc.backend.service;

import com.teamadc.backend.model.Comment;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class CommentService {

    private final GenericRepository<Comment> commentRepository;

    @Autowired
    public CommentService(GenericRepository<Comment> commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment createOrUpdateComment(Comment comment) throws InterruptedException, ExecutionException {
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId) throws InterruptedException, ExecutionException {
        commentRepository.deleteById(commentId);
    }

    public Comment getCommentById(String commentId) throws InterruptedException, ExecutionException {
        return commentRepository.findById(commentId);
    }

    public List<Comment> getComments() throws InterruptedException, ExecutionException {
        return commentRepository.findAll();
    }

}
