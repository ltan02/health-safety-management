import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Grid } from "@mui/material";
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

function EditFieldForm({form}) {
  const [formData, setFormData] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    setFormData(form["formData"]);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = formData.findIndex((item) => item.id === active.id);
      const newIndex = formData.findIndex((item) => item.id === over.id);

      // Swap coordinates
      let newFormData = [...formData];
      [newFormData[oldIndex].coordinate, newFormData[newIndex].coordinate] = [newFormData[newIndex].coordinate, newFormData[oldIndex].coordinate];
      
      // Move item in the array for visual reordering
      newFormData = arrayMove(newFormData, oldIndex, newIndex);
      
      setFormData(newFormData);
    }
    setActiveId(null);
  };

  // Calculate sorted rows based on updated formData
  const sortedRows = formData.reduce((acc, field) => {
    const { y } = field.coordinate;
    if (!acc[y]) {
      acc[y] = [];
    }
    acc[y].push(field);
    return acc;
  }, {});

  const sortedRowKeys = Object.keys(sortedRows).sort((a, b) => a - b).map((y) => ({
    row: y,
    fields: sortedRows[y].sort((a, b) => a.coordinate.x - b.coordinate.x),
  }));

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
            items={formData.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <Grid container spacing={2} alignItems="top">
              {sortedRowKeys.map((row, rowIndex) => (
                <Grid container spacing={2} key={rowIndex} alignItems="center">
                  {row.fields.map((fieldData) => (
                    <Grid item xs={12} sm={6} key={fieldData.id}>
                      <FieldComponentWrapper fieldData={fieldData} />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default EditFieldForm;
