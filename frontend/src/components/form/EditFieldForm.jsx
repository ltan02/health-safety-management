import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Divider,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
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
  updateFormName,
  handleClose,
  formName,
}) {
  const [fieldsData, setFieldsData] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [currentFormName, setCurrentFormName] = useState(formName);
  const [isEdited, setIsEdited] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      await updateFieldCoordinate(fieldsData);
      await updateFormName(currentFormName);
    } catch (error) {
      console.error("Error updating field coordinate:", error);
    } finally {
      setIsLoading(false);
      setIsEdited(false);
    }
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
    newEditingField.aiField = fieldData.aiField;

    updateField(newEditingField);
  };

  const handleFormNameChange = (name) => {
    setCurrentFormName(name);
    setIsEdited(true);
  };

  return (
    <Container style={{ height: "80vh", width: "80vh", overflow: "auto", border: "solid 2px #7D7D7D"}}>
      {isEdited && (
        <Container sx={{ position: "fixed", bottom: "10px", right: "10px"}}>
          <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
            <Button onClick={handleClose} variant="contained" color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleFieldUpdateCoordinate}
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Container>
      )}
      <TextField
        onChange={(e) => handleFormNameChange(e.target.value)}
        variant="standard"
        textAlign={'center'}
        defaultValue={currentFormName}
        InputProps={{ style: { fontSize: 28, fontWeight:600} }}
        sx={{ marginTop: 1,  width: "100%", p: 2}}
      />
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
            <Grid container spacing={2} alignItems="top">
              {sortedRows().map((row, rowIndex) => (
                <Grid container key={rowIndex} alignItems="center">
                  {row.fields.map((fieldData) => (
                    <Grid item md={12} key={fieldData.id} sx={{ my: 2 }}>
                      <FieldComponentWrapper
                        fieldData={fieldData}
                        onDelete={() => handleOpenDeleteModal(fieldData)}
                        onEdit={handleOpenEdit}
                        fields={fields}
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
          fieldsData={fieldsData}
        />
      )}
    </Container>
  );
}

export default EditFieldForm;
