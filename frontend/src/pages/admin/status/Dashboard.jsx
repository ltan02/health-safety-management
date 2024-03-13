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
import useAxios from "../../../hooks/useAxios";

function Dashboard({ columns, state, updateBoard, boardId }) {
    const [tasks, setTasks] = useState({ UNASSIGNED: [] });
    const [activeId, setActiveId] = useState(null);
    const [workflowColumns, setWorkflowColumns] = useState(columns);
    const sensors = useSensors(useSensor(PointerSensor));
    const dropAnimation = {
        ...defaultDropAnimation,
    };
    const { sendRequest } = useAxios();

    function handleRenameColumn(columnId, name) {
        const newColumns = workflowColumns.map((column) => {
            if (column.id === columnId) {
                column.title = name;
            }
            return column;
        });
        setWorkflowColumns(newColumns);
    }

    const updateStatus = async (statusId, fromColumnId, toColumnId) => {
        await sendRequest({
            url: `/boards/${boardId}/status/${statusId}`,
            method: "POST",
            body: { fromColumnId, toColumnId },
        });
        updateBoard();
    };

    function handleDragOver(event) {
        const { active, over } = event;
        if (!over) return;

        const sourceColumnId = Object.keys(tasks).find((columnId) =>
            tasks[columnId].find((task) => task.id === active.id),
        );

        const destinationColumnId = Object.keys(tasks).find((columnId) =>
            tasks[columnId].find((task) => task.id === over.id),
        );

        if (sourceColumnId === destinationColumnId) {
            setTasks((prevTasks) => {
                const columnTasks = [...prevTasks[sourceColumnId]];
                const overIndex = columnTasks.findIndex((task) => task.id === over.id);
                const activeIndex = columnTasks.findIndex((task) => task.id === active.id);

                if (overIndex === activeIndex) {
                    return prevTasks;
                }

                const item = columnTasks[activeIndex];
                columnTasks.splice(activeIndex, 1);
                columnTasks.splice(overIndex, 0, item);

                return {
                    ...prevTasks,
                    [sourceColumnId]: columnTasks,
                };
            });
        }
    }

    function handleStart(event) {
        const { active } = event;
        setActiveId(active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (over) {
            const sourceColumnId = Object.keys(tasks).find((columnId) =>
                tasks[columnId].find((task) => task.id === active.id),
            );

            const destinationColumnId = Object.keys(tasks).find((columnId) =>
                tasks[columnId].find((task) => task.id === over.id),
            );

            if (!destinationColumnId || sourceColumnId === destinationColumnId) {
                setActiveId(null);
                return;
            }

            setTasks((prevTasks) => {
                const sourceTasks = [...prevTasks[sourceColumnId]];
                const destinationTasks = [...(prevTasks[destinationColumnId] || [])];
                const taskIndex = sourceTasks.findIndex((task) => task.id === active.id);
                const task = sourceTasks[taskIndex];

                sourceTasks.splice(taskIndex, 1);

                destinationTasks.push(task);

                return {
                    ...prevTasks,
                    [sourceColumnId]: sourceTasks,
                    [destinationColumnId]: destinationTasks,
                };
            });

            updateStatus(active.id, sourceColumnId, destinationColumnId);
        }

        setActiveId(null);
    }

    useEffect(() => {
        if (!columns || !state) {
            return;
        }

        setTasks((currentTasks) => {
            const newTasks = { ...currentTasks, UNASSIGNED: [] };

            const assignedTaskIds = new Set();

            columns.forEach((column) => {
                newTasks[column.id] = column.statusIds
                    .map((statusId) => state.find((task) => task.id === statusId))
                    .filter((task) => task);

                newTasks[column.id].forEach((task) => assignedTaskIds.add(task.id));
            });

            state.forEach((task) => {
                if (!assignedTaskIds.has(task.id)) {
                    newTasks["UNASSIGNED"].push(task);
                }
            });

            return newTasks;
        });

        setWorkflowColumns(columns);
    }, [columns, state]);

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
                            id={"UNASSIGNED"}
                            title="Unassigned"
                            tasks={(tasks && tasks["UNASSIGNED"]) || []}
                            activeId={activeId}
                        />
                    </Grid>
                    <Grid item style={{ overflowX: "auto", flex: 1 }}>
                        <Grid container direction="row" wrap="nowrap" spacing={2}>
                            {workflowColumns.map((column) => (
                                <Grid key={column.id} item>
                                    <Column
                                        id={column.id}
                                        title={column.name}
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
