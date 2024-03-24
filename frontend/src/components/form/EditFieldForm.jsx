import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Grid, Modal, Box } from "@mui/material";
import FieldComponentWrapper from "./FieldComponentWrapper";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import DeleteFieldModal from "./DeleteFieldModal";
import EditFieldModal from "./EditFieldModal";

function EditFieldForm({
  updateFieldCoordinate,
  fields,
  sortedRows,
  deleteField,
  updateField,
  handleClose,
}) {
  const [fieldsData, setFieldsData] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setFieldsData(fields);
  }, []);

  useEffect(() => {
    setFieldsData(fields);
  }, [fields]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fieldsData.findIndex((item) => item.id === active.id);
      const newIndex = fieldsData.findIndex((item) => item.id === over.id);

      let newFormData = [...fieldsData];

      if (newIndex === -1) {
        const newField = sortedRows()
          .find((row) => row.fields.find((field) => field.id === over.id))
          .fields.find((field) => field.id === over.id);
        newFormData[oldIndex].coordinate = newField.coordinate;
      } else {
        [newFormData[oldIndex].coordinate, newFormData[newIndex].coordinate] = [
          newFormData[newIndex].coordinate,
          newFormData[oldIndex].coordinate,
        ];
      }

      newFormData = arrayMove(newFormData, oldIndex, newIndex);
      setFieldsData(newFormData);
      setIsEdited(true);
    }
    setActiveId(null);
  };

  const handleFieldUpdateCoordinate = async () => {
    setIsEdited(false);
    updateFieldCoordinate(fieldsData);
  };

  const onHandleDelete = () => {
    const newFormData = fieldsData.filter((item) => item.id !== activeField.id);
    setFieldsData(newFormData);
    setOpen(false);
    deleteField(activeField.id);
  };

  const handleOpenDeleteModal = (fieldData) => {
    setOpen(true);
    setActiveField(fieldData);
  };

  const handleOpenEdit = (fieldData) => {
    if (fieldData) {
      setEditingField(fieldData);
      setOpenEdit(true);
    }
  };

  const handleEditField = (fieldData) => {
    const newFieldData = { ...fieldData };
    const newEditingField = { ...editingField };
    Object.keys(fieldData).map((key) => {
      if (!fieldData[key]) {
        newFieldData[key] = newEditingField.props[key];
      }
    });

    newEditingField.props = newFieldData;

    updateField(newEditingField);
  };

  return (
    <Container style={{ height: "80vh", width: "80vh", overflow: "auto" }}>
      {isEdited && (
        <Container sx={{ position: "fixed", top: 10, right: 10 }}>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button onClick={handleClose} variant="contained" color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleFieldUpdateCoordinate}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </Box>
        </Container>
      )}
      <Typography variant="h6" align="center" sx={{ my: 5 }}>
        Incident Report Form
      </Typography>
      <form onSubmit={(e) => e.preventDefault()}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          // onDragEnd={handleDragEnd}
          onDragOver={handleDragEnd}
          onDragStart={(event) => setActiveId(event.active.id)}
        >
          <SortableContext
            items={fieldsData.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <Grid container spacing={2} alignItems="center">
              {sortedRows().map((row, rowIndex) => (
                <Grid container key={rowIndex} alignItems="center">
                  {row.fields.map((fieldData) => (
                    <Grid item xs={12} sm={6} key={fieldData.id}>
                      <FieldComponentWrapper
                        fieldData={fieldData}
                        onDelete={() => handleOpenDeleteModal(fieldData)}
                        onEdit={handleOpenEdit}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
      </form>
      <DeleteFieldModal
        open={open}
        setOpen={setOpen}
        onHandleDelete={onHandleDelete}
      />
      {editingField && (
        <EditFieldModal
          open={openEdit}
          setOpen={setOpenEdit}
          onHandleEdit={handleEditField}
          fieldData={editingField}
        />
      )}
    </Container>
  );
}

export default EditFieldForm;
