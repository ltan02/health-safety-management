import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimation,
} from "@dnd-kit/core";
import { Container, Grid} from "@mui/material";
import Column from "./Column";
import Task from "./Task";
import { TextField } from "@mui/material";
import { initialTasks, STATE, COLUMNS } from "./report_constants";



function Dashboard() {
  const [tasks, setTasks] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [visibleTasks, setVisibleTasks] = useState(null);
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
      acc[status] = tasks[status].filter((task) => task.title.toLowerCase().includes(q));
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

    if (sourceColumn && destinationColumn && over.id !== active.id) {
      console.log(active.id);
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
        tasks[sourceColumn][activeIndex] = tasks[destinationColumn][overIndex];
        tasks[destinationColumn][overIndex] = temp;
      }
    }
    if (over && STATE[over.id]) {
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

  function handleAddTask(task) {
    tasks[task.column].push(task);
    setTasks(tasks);
  }

  useEffect(() => {
    setTasks({
      [STATE.TODO]: [
        ...initialTasks.filter((task) => task.status === STATE.TODO),
      ],
      [STATE.INPROGRESS]: [
        ...initialTasks.filter((task) => task.status === STATE.INPROGRESS),
      ],
      [STATE.DONE]: [
        ...initialTasks.filter((task) => task.status === STATE.DONE),
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
          {COLUMNS.map((column) => (
            <Grid item key={column.id} xs={12} sm={6} md={4}>
              <Column
                id={column.id}
                title={column.title}
                tasks={(visibleTasks && visibleTasks[column.id]) || []}
                activeId={activeId}
                handleAddTask={handleAddTask}
              />
            </Grid>
          ))}
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
        </Grid>
      </DndContext>
    </Container>
  );
}

export default Dashboard;
