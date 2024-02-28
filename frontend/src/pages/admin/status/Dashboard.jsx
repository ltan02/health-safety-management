import { useState, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import { Container, Grid } from "@mui/material";
import Column from "./Column";
import Task from "./Task";
import UnassignedColumn from "./UnassignedColumn";
import { STATE } from "../initial_tasks";

function Dashboard({ initialWorkflows, columns, state }) {
  const [tasks, setTasks] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [workflowColumns, setWorkflowColumns] = useState(columns);
  const sensors = useSensors(useSensor(PointerSensor));
  const dropAnimation = {
    ...defaultDropAnimation,
  };

  function handleRenameColumn(columnId, name) {
    const newColumns = workflowColumns.map((column) => {
      if (column.id === columnId) {
        column.title = name;
      }
      return column;
    });
    setWorkflowColumns(newColumns);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    // Calculate the source and destination columns and the index of the task to be moved
    // i will make this as hook later but not now
    let newTasks = JSON.parse(JSON.stringify(tasks));
    let sourceColumn = Object.keys(newTasks).find((column) => {
      return newTasks[column].find((task) => task.id === active.id);
    });

    let destinationColumn = Object.keys(newTasks).find((column) => {
      return newTasks[column].find((task) => task.id === over?.id);
    });

    let overIndex = Object.entries(newTasks)
      .map(([, subs]) => {
        return subs.findIndex((task) => task.id === over?.id);
      })
      .filter((index) => index !== -1)[0];

    let activeIndex = Object.entries(newTasks)
      .map(([, subs]) => {
        return subs.findIndex((task) => task.id === active.id);
      })
      .filter((index) => index !== -1)[0];
    if (sourceColumn && over.id !== active.id) {
      if (destinationColumn === undefined) {
        newTasks[over.id].push(newTasks[sourceColumn][activeIndex]);
        newTasks[sourceColumn].splice(activeIndex, 1);
        sourceColumn = over.id;
      } else {
        if (sourceColumn !== destinationColumn) {
          newTasks[sourceColumn][activeIndex].status = destinationColumn;
          newTasks[destinationColumn].push(newTasks[sourceColumn][activeIndex]);
          newTasks[sourceColumn].splice(activeIndex, 1);
          sourceColumn = destinationColumn;
        } else if (overIndex != -1) {
          activeIndex = Object.entries(newTasks)
            .map(([, subs]) => {
              return subs.findIndex((task) => task.id === active.id);
            })
            .filter((index) => index !== -1)[0];
          const temp = newTasks[sourceColumn][activeIndex];
          newTasks[sourceColumn][activeIndex] =
            newTasks[destinationColumn][overIndex];
          newTasks[destinationColumn][overIndex] = temp;
        }
      }
    }
    setTasks(newTasks);
  }

  function handleStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragEnd() {
    setActiveId(null);
  }

  useEffect(() => {
    setTasks({
      [state.TODO]: [...initialWorkflows.filter((task) => task.name === state.TODO)],
      [state.INPROGRESS]: [
        ...initialWorkflows.filter((task) => task.name === state.INPROGRESS),
      ],
      [state.DONE]: [...initialWorkflows.filter((task) => task.name === state.DONE)],
      [state.UNASSIGNED]: [...initialWorkflows.filter((task) => task.name === state.UNASSIGNED)],
    });
    console.log(initialWorkflows)
  }, []);

  return (
    <Container>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleStart}
      >
        <Grid container direction="row">
          <Grid item>
            <UnassignedColumn
              id={STATE.UNASSIGNED}
              title="Unassigned"
              tasks={(tasks && tasks[state.UNASSIGNED]) || []}
              activeId={activeId}
            />
          </Grid>
          <Grid item style={{ overflowX: "auto", flex: 1 }}>
            <Grid container direction="row" wrap="nowrap"  spacing={2}>
              {workflowColumns.map((column) => (
                <Grid key={column.id} item>
                  <Column
                    id={column.id}
                    title={column.title}
                    tasks={(tasks && tasks[column.id]) || []}
                    activeId={activeId}
                    handleRenameColumn={handleRenameColumn}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId && (
            <Task
              id={activeId}
              task={Object.values(tasks)
                .flat()
                .find((task) => task.id === activeId)}
            />
          )}
        </DragOverlay>
      </DndContext>
    </Container>
  );
}

export default Dashboard;
