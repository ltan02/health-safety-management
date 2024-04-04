package com.teamadc.backend.service;

import com.teamadc.backend.model.Form;
import com.teamadc.backend.model.Field;
import com.teamadc.backend.model.FieldProp;
import com.teamadc.backend.model.FieldOption;
import com.teamadc.backend.dto.request.FieldCoordinateRequest;
import com.teamadc.backend.dto.request.FormNameRequest;
import com.teamadc.backend.model.AiField;
import com.teamadc.backend.model.Coordinate;
import com.teamadc.backend.repository.GenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class FormService {
    private final GenericRepository<Form> formRepository;
    private final GenericRepository<Field> fieldRepository;
    private final GenericRepository<FieldProp> fieldPropRepository;

    @Autowired
    public FormService(GenericRepository<Form> formRepository, GenericRepository<Field> fieldRepository,
            GenericRepository<FieldProp> fieldPropRepository) {
        this.formRepository = formRepository;
        this.fieldRepository = fieldRepository;
        this.fieldPropRepository = fieldPropRepository;
    }

    public Form createOrUpdateForm(Form form) throws InterruptedException, ExecutionException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        if (form.getDateAdded() == null) {
            String currentDateStr = sdf.format(new Date(System.currentTimeMillis()));
            form.setDateAdded(currentDateStr);
        }
        if (form.getDateModified() == null) {
            String currentDateStr = sdf.format(new Date(System.currentTimeMillis()));
            form.setDateModified(currentDateStr);
        }
        if (form.getFields() == null) {
            form.setFields(createDefaultField());
        }
        return formRepository.save(form);
    }

    public List<Field> createDefaultField() throws InterruptedException, ExecutionException {

        FieldProp employeeInvolvedFieldProp = new FieldProp("Employees Involved", "employees_involved", true,
                "Employees Involved", "The employee involved in the incident", null);
        fieldPropRepository.save(employeeInvolvedFieldProp);
        Field employeeInvolvedField = new Field();
        employeeInvolvedField.setProps(employeeInvolvedFieldProp);
        employeeInvolvedField.setName("Employees Involved");
        employeeInvolvedField.setCoordinate(new Coordinate(0, 0));
        employeeInvolvedField.setType("selection-multi");
        fieldRepository.save(employeeInvolvedField);

        FieldProp descriptionFieldProp = new FieldProp("Description", "description", true, "Description",
                "The description of the incident", null);
        fieldPropRepository.save(descriptionFieldProp);
        Field descriptionField = new Field();
        descriptionField.setProps(descriptionFieldProp);
        descriptionField.setName("Description");
        descriptionField.setCoordinate(new Coordinate(1, 0));
        descriptionField.setType("description");
        fieldRepository.save(descriptionField);

        FieldProp categoryFieldProp = new FieldProp("Category", "category", true, "Category",
                "The category of the incident", null);
        fieldPropRepository.save(categoryFieldProp);
        Field categoryField = new Field();
        categoryField.setProps(categoryFieldProp);
        categoryField.setName("Category");
        categoryField.setCoordinate(new Coordinate(0, 1));
        categoryField.setType("category");
        fieldRepository.save(categoryField);

        FieldProp dateFieldProp = new FieldProp("Time Of Incident", "incidentDate", true, "Date", "The precise date and time when the incident took place, in YYYY/MM/DD HH:MM format.", null);
        fieldPropRepository.save(dateFieldProp);
        Field dateField = new Field();
        dateField.setProps(dateFieldProp);
        dateField.setName("Date");
        dateField.setCoordinate(new Coordinate(1, 1));
        dateField.setType("datetime-local");
        fieldRepository.save(dateField);

        List<Field> fields = List.of(employeeInvolvedField, descriptionField, categoryField, dateField);

        return fields;
    }

    public Form updateForm(String formId, Form newForm) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        for (Field newField : newForm.getFields()) {
            FieldProp fieldProp = newField.getProps();
            fieldPropRepository.save(fieldProp);
            fieldRepository.save(newField);
        }
        form.setFields(newForm.getFields());
        form.setDateModified(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(System.currentTimeMillis())));
        return formRepository.save(form);
    }

    public Form updateFormName(String formId, FormNameRequest request) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        form.setName(request.getName());
        form.setDateModified(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(System.currentTimeMillis())));
        return formRepository.save(form);
    }

    public Form addField(String formId, Field field) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        FieldProp fieldProp = field.getProps();

        fieldPropRepository.save(fieldProp);
        fieldRepository.save(field);
        List<Field> fields = form.getFields();
        fields.add(field);
        form.setFields(fields);
        form.setDateModified(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(System.currentTimeMillis())));
        return formRepository.save(form);
    }

    public Form deleteField(String formId, String fieldId) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        List<Field> fields = form.getFields();
        for (Field field : fields) {
            if (field.getId().equals(fieldId)) {
                fields.remove(field);
                fieldRepository.deleteById(fieldId);
                break;
            }
        }
        form.setFields(fields);
        form.setDateModified(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(System.currentTimeMillis())));
        return formRepository.save(form);
    }

    public Form updateField(String formId, String fieldId, Field field)
            throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        List<Field> fields = form.getFields();
        Field fieldToUpdate = fields.stream()
                .filter(f -> f.getId().equals(fieldId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Field not found with id: " + fieldId));
        AiField aiField = field.getAiField();
        fieldToUpdate.setAiField(aiField);
        fieldToUpdate.setProps(field.getProps());
        fields.removeIf(f -> f.getId().equals(fieldId));
        fields.add(fieldToUpdate);

        fieldRepository.save(fieldToUpdate);
        form.setFields(fields);
        form.setDateModified(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(System.currentTimeMillis())));
        return formRepository.save(form);
    }

    public Field updateCoordinate(String formId, String fieldId, Coordinate coordinate)
            throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        List<Field> fields = form.getFields();
        Field fieldToUpdate = fields.stream()
                .filter(f -> f.getId().equals(fieldId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Field not found with id: " + fieldId));
        fieldToUpdate.setCoordinate(coordinate);
        fields.removeIf(f -> f.getId().equals(fieldId));
        fields.add(fieldToUpdate);

        fieldRepository.save(fieldToUpdate);
        form.setFields(fields);
        formRepository.save(form); // field collection is updated, but field in form is not updated when we try
                                   // replacing the coordinates

        return form.getFields().stream()
                .filter(f -> f.getId().equals(fieldId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Field not found with id: " + fieldId));
    }

    public Form updateCoordinates(String formId, List<FieldCoordinateRequest> fields)
            throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        List<Field> formFields = form.getFields();
        for (FieldCoordinateRequest field : fields) {
            Field fieldToUpdate = formFields.stream()
                    .filter(f -> f.getId().equals(field.getId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("Field not found with id: " + field.getId()));
            fieldToUpdate.setCoordinate(field.getCoordinate());
            formFields.removeIf(f -> f.getId().equals(field.getId()));
            formFields.add(fieldToUpdate);
            fieldRepository.save(fieldToUpdate);
        }

        form.setFields(formFields);
        return formRepository.save(form);
    }

    public void deleteForm(String formId) throws InterruptedException, ExecutionException {
        formRepository.deleteById(formId);
    }

    public Form getFormById(String formId) throws InterruptedException, ExecutionException {
        return formRepository.findById(formId);
    }

    public Form setFormStatus(String formId, Boolean active) throws InterruptedException, ExecutionException {
        Form form = formRepository.findById(formId);
        form.setActive(active);
        return formRepository.save(form);
    }

    public Form getActiveForm() throws InterruptedException, ExecutionException {
        return formRepository.findAll().stream()
                .filter(Form::getActive)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active form found"));
    }

    public List<Form> getForms() throws InterruptedException, ExecutionException {
        return formRepository.findAll();
    }

}
