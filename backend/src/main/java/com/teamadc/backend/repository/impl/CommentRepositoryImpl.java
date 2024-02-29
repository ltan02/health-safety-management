package com.teamadc.backend.repository.impl;

import com.teamadc.backend.model.Comment;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.stereotype.Repository;

@Repository
public class CommentRepositoryImpl extends AbstractFirestoreRepository<Comment> implements GenericRepository<Comment> {
    public CommentRepositoryImpl() {
        super(Comment.class);
    }

    @Override
    protected String getCollectionName() {
        return "comments";
    }
}
