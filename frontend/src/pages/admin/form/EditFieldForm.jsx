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

function EditFieldForm({
  updateFieldCoordinate,
  fields,
  sortedRows,
  deleteField,
  handleClose,
}) {
  const [fieldsData, setFieldsData] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [open, setOpen] = useState(false);
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

      if (newIndex === -1) { // if empty space
        const newField = sortedRows().find(row => 
          row.fields.find(field => field.id === over.id)
        ).fields.find(field => field.id === over.id);
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

  return (
    <Container style={{ height: "80vh", width: "80vh", overflow: "auto" }}>
       {isEdited && (
        <Container sx={{ position: "fixed", top: 10, right:10 }}>
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
            <Grid container spacing={2} alignItems="top">
              {sortedRows().map((row, rowIndex) => (
                <Grid container spacing={2} key={rowIndex} alignItems="center">
                  {row.fields.map((fieldData) => (
                    <Grid item xs={12} sm={6} key={fieldData.id}>
                      <FieldComponentWrapper
                        fieldData={fieldData}
                        onDelete={() => handleOpenDeleteModal(fieldData)}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
        <Grid container spacing={2} alignItems="top">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, display: "block", ml: "auto", mr: "auto" }}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 3, display: "block", ml: "auto", mr: "auto" }}
          >
            Cancel
          </Button>
        </Grid>
      </form>
      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="delete-confirmation-modal"
          aria-describedby="delete-confirmation-modal-description"
          closeAfterTransition
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="delete-confirmation-modal"
              variant="h6"
              component="h2"
              align="center"
              gutterBottom
            >
              Are you sure you want to delete this field?
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onHandleDelete}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Container>
  );
}

export default EditFieldForm;
