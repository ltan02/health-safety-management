package com.teamadc.backend.repository.impl;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
public abstract class AbstractFirestoreRepository<T> {
    private final Class<T> clazz;

    @Autowired
    protected Firestore firestore;

    protected AbstractFirestoreRepository(Class<T> clazz) {
        this.clazz = clazz;
    }

    protected String getCollectionName() {
        return "default";
    }

    public T save(T entity) throws InterruptedException, ExecutionException {
        String id;
        try {
            Method getIdMethod = clazz.getMethod("getId");
            id = (String) getIdMethod.invoke(entity);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            id = null;
        }

        DocumentReference docRef;

        if (id != null && !id.trim().isEmpty()) {
            docRef = firestore.collection(getCollectionName().toLowerCase()).document(id);
            ApiFuture<WriteResult> writeResult = docRef.set(entity);
        } else {
            ApiFuture<DocumentReference> future = firestore.collection(getCollectionName().toLowerCase()).add(entity);
            docRef = future.get();
        }

        DocumentSnapshot documentSnapshot = docRef.get().get();
        if (documentSnapshot.exists()) {
            return documentSnapshot.toObject(clazz);
        } else {
            return null;
        }
    }

    public T findById(String id) throws InterruptedException, ExecutionException {
        DocumentSnapshot document = firestore.collection(this.getCollectionName().toLowerCase()).document(id).get().get();
        if (document.exists()) {
            return document.toObject(clazz);
        } else {
            return null;
        }
    }

    public List<T> findAll() throws InterruptedException, ExecutionException {
        List<T> entities = new ArrayList<>();
        ApiFuture<QuerySnapshot> querySnapshot = firestore.collection(this.getCollectionName().toLowerCase()).get();
        for (DocumentSnapshot doc : querySnapshot.get().getDocuments()) {
            entities.add(doc.toObject(clazz));
        }
        return entities;
    }

    public void deleteById(String id) throws InterruptedException, ExecutionException {
        firestore.collection(this.getCollectionName().toLowerCase()).document(id).delete();
    }
}
