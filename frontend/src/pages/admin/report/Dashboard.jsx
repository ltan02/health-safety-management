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

const STATE = {
  INPROGRESS: "INPROGRESS",
  DONE: "DONE",
  TODO: "TODO",
};
const columns = [
  { id: STATE.TODO, title: "To Do" },
  { id: STATE.INPROGRESS, title: "In Progress" },
  { id: STATE.DONE, title: "Done" },
];

// assume that we can get the tasks from api something like this
const initialTasks = [
  {
    id: "task1", //random things here
    title: "Fix some issues",
    assignee: "John Doe",
    description: "There are some issues that need to be fixed",
    status: STATE.INPROGRESS,
    deadline: "2024-02-31:20:20:00",
  },
  {
    id: "task2",
    title: "Update workflows",
    assignee: "Jane Smith",
    description: "Update workflows",
    status: STATE.INPROGRESS,
    deadline: "2024-10-31:20:20:00",
  },
  {
    id: "task3",
    title: "Create a new workflows",
    assignee: "Alice Johnson",
    description: "Update workflows",
    status: STATE.DONE,
    deadline: "2024-01-30:20:20:00",
  },
  {
    id: "task4",
    title: "Add report",
    assignee: "Bob Brown",
    description:
      "Implement the new communication feature as per the specifications.",
    status: STATE.TODO,
    deadline: "2024-12-31:20:20:00",
  },
];
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
    if (!search) {
      setVisibleTasks(tasks);
    }
  }, [search, tasks]);

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
          {columns.map((column) => (
            <Grid item key={column.id} xs={12} sm={6} md={4}>
              <Column
                id={column.id}
                title={column.title}
                tasks={(visibleTasks && visibleTasks[column.id]) || []}
                activeId={activeId}
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
