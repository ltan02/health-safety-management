import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Grid, Fab } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import FieldComponentWrapper from "./FieldComponentWrapper";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

function EditFieldForm({ updateFieldCoordinate, fields }) {
  const [fieldsData, setFieldsData] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setFieldsData(fields);
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fieldsData.findIndex((item) => item.id === active.id);
      const newIndex = fieldsData.findIndex((item) => item.id === over.id);

      let newFormData = [...fieldsData];
      [newFormData[oldIndex].coordinate, newFormData[newIndex].coordinate] = [
        newFormData[newIndex].coordinate,
        newFormData[oldIndex].coordinate,
      ];

      //handleReplaceCoordinate(newFormData[oldIndex].id, newFormData[oldIndex].coordinate, newFormData[newIndex].id, newFormData[newIndex].coordinate);

      // console.log(newFormData[oldIndex].type);
      // console.log(newFormData[oldIndex].coordinate);
      // console.log(newFormData[newIndex].type);
      // console.log(newFormData[newIndex].coordinate);
      // Move item in the array for visual reordering
      newFormData = arrayMove(newFormData, oldIndex, newIndex);

      setFieldsData(newFormData);
      setIsEdited(true);
    }
    setActiveId(null);
  };

  const handleUpdateCoordinate = async () => {
    setIsEdited(false);
    console.log(fieldsData);
    return Promise.all(
      fieldsData.map(async (field) => {
        return await updateFieldCoordinate(field.id, field.coordinate);
      })
    );
  };

  const sortedRows = fieldsData.reduce((acc, field) => {
    const { y } = field.coordinate;
    if (!acc[y]) {
      acc[y] = [];
    }
    acc[y].push(field);
    return acc;
  }, {});

  const sortedRowKeys = Object.keys(sortedRows)
    .sort((a, b) => a - b)
    .map((y) => ({
      row: y,
      fields: sortedRows[y].sort((a, b) => a.coordinate.x - b.coordinate.x),
    }));

  const onHandleDelete = (fieldData) => {
    const newFormData = fieldsData.filter((item) => item.id !== fieldData.id);
    setFieldsData(newFormData);
  };

  return (
    <Container style={{ height: "700px", width: "700px", overflow: "auto" }}>
      <Typography variant="h6" align="center" sx={{ my: 5 }}>
        Incident Report Form
      </Typography>
      <form onSubmit={(e) => e.preventDefault()}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          onDragStart={(event) => setActiveId(event.active.id)}
        >
          <SortableContext
            items={fieldsData.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <Grid container spacing={2} alignItems="top">
              {sortedRowKeys.map((row, rowIndex) => (
                <Grid container spacing={2} key={rowIndex} alignItems="center">
                  {row.fields.map((fieldData) => (
                    <Grid item xs={12} sm={6} key={fieldData.id}>
                      <FieldComponentWrapper
                        fieldData={fieldData}
                        onDelete={onHandleDelete}
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
      {isEdited && (
        <Button
          onClick={handleUpdateCoordinate}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      )}
    </Container>
  );
}

export default EditFieldForm;
