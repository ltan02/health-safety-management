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
import { TextField, Paper } from "@mui/material";
import UnassignedColumn from "./UnassignedColumn";

function Dashboard({ initialTasks, columns, state }) {
  const [tasks, setTasks] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [visibleTasks, setVisibleTasks] = useState(null);
  const [workflowColumns, setWorkflowColumns] = useState(columns);
  const sensors = useSensors(useSensor(PointerSensor));
  const dropAnimation = {
    ...defaultDropAnimation,
  };

  function handleSearch(event) {
    const q = event.target.value.toLowerCase();
    setSearch(q);

    if (!q) {
      setVisibleTasks(tasks);
      return;
    }
    const filteredTasks = Object.keys(tasks).reduce((acc, status) => {
      acc[status] = tasks[status].filter((task) =>
        task.title.toLowerCase().includes(q)
      );
      return acc;
    }, {});
    setVisibleTasks(filteredTasks);
  }

  function handleDragOver(event) {
    const { active, over } = event;

    // Calculate the source and destination columns and the index of the task to be moved
    // i will make this as hook later but not now
    let sourceColumn = Object.keys(tasks).find((column) => {
      return tasks[column].find((task) => task.id === active.id);
    });

    let destinationColumn = Object.keys(tasks).find((column) => {
      return tasks[column].find((task) => task.id === over?.id);
    });

    let overIndex = Object.entries(tasks)
      .map(([, subs]) => {
        return subs.findIndex((task) => task.id === over?.id);
      })
      .filter((index) => index !== -1)[0];

    let activeIndex = Object.entries(tasks)
      .map(([, subs]) => {
        return subs.findIndex((task) => task.id === active.id);
      })
      .filter((index) => index !== -1)[0];

    if (sourceColumn && over.id !== active.id) {
      // if empty column
      if (destinationColumn === undefined) {
        tasks[over.id].push(tasks[sourceColumn][activeIndex]);
        tasks[sourceColumn].splice(activeIndex, 1);
        sourceColumn = over.id;
      } else {
        if (sourceColumn !== destinationColumn) {
          tasks[sourceColumn][activeIndex].status = destinationColumn;
          tasks[destinationColumn].push(tasks[sourceColumn][activeIndex]);
          tasks[sourceColumn].splice(activeIndex, 1);
          sourceColumn = destinationColumn;
        } else if (overIndex != -1) {
          activeIndex = Object.entries(tasks)
            .map(([, subs]) => {
              return subs.findIndex((task) => task.id === active.id);
            })
            .filter((index) => index !== -1)[0];
          const temp = tasks[sourceColumn][activeIndex];
          tasks[sourceColumn][activeIndex] =
            tasks[destinationColumn][overIndex];
          tasks[destinationColumn][overIndex] = temp;
        }
      }
    }
    if (over && state[over.id]) {
      const status = over.id;
      tasks[sourceColumn][activeIndex].status = status;
      tasks[status].push(tasks[sourceColumn][activeIndex]);
      tasks[sourceColumn].splice(activeIndex, 1);
      sourceColumn = status;
    }

    setTasks(tasks);
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
      [state.TODO]: [
        ...initialTasks.filter((task) => task.status === state.TODO),
      ],
      [state.INPROGRESS]: [
        ...initialTasks.filter((task) => task.status === state.INPROGRESS),
      ],
      [state.DONE]: [
        ...initialTasks.filter((task) => task.status === state.DONE),
      ],
    });
  }, []);

  useEffect(() => {
    setVisibleTasks(tasks);
  }, [tasks]);

  return (
    <Container>
      <TextField
        value={search}
        onChange={handleSearch}
        variant="standard"
        placeholder="Search"
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleStart}
      >
        <Grid container spacing={2}>
          <Grid container spacing={2}>
            {/* Unassigned Column */}
            <Grid item xs={12} sm={6} md={2} lg={3}>
              <UnassignedColumn
                id="unassigned"
                title="Unassigned"
                tasks={(visibleTasks && visibleTasks["unassigned"]) || []}
                activeId={activeId}
              />
            </Grid>

            {/* Other Columns */}
            {workflowColumns.map((column) => (
              <Grid item xs={12} sm={6} md={2} lg={3} key={column.id}>
                <Column
                  id={column.id}
                  title={column.title}
                  tasks={(visibleTasks && visibleTasks[column.id]) || []}
                  activeId={activeId}
                />
              </Grid>
            ))}
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
        </Grid>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId &&
            Object.values(tasks)
              .flat()
              .find((task) => task.id === activeId) && (
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
