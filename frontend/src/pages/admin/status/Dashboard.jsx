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
import { useAuthContext } from "../../../context/AuthContext";
import { isPrivileged } from "../../../utils/permissions";

function Dashboard({ columns, state, updateBoardStatus, boardId }) {
    const { user } = useAuthContext();
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

    const updateStatus = async (statusId, toColumnId) => {
        if (Object.keys(tasks).some((columnId) => tasks[columnId].some((task) => task.id === toColumnId))) {
            toColumnId = "UNASSIGNED";
        }

        sendRequest({
            url: `/boards/${boardId}/status/${statusId}`,
            method: "POST",
            body: { type: isPrivileged(user.role) ? "ADMIN" : "EMPLOYEE", toColumnId },
        });
    };

    function handleDragOver(event) {
        const { active, over } = event;
        if (!over) return;

        const sourceColumnId = Object.keys(tasks).find((columnId) =>
            tasks[columnId].find((task) => task.id === active.id),
        );

        let destinationColumnId;
        if (Object.keys(tasks).includes(over.id)) {
            destinationColumnId = over.id;
        } else {
            destinationColumnId = Object.keys(tasks).find((columnId) =>
                tasks[columnId].find((task) => task.id === over.id),
            );
        }

        if (!sourceColumnId || !destinationColumnId) {
            return;
        }

        setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            const activeTask = newTasks[sourceColumnId].find((task) => task.id === active.id);
            const movingTaskIndex = newTasks[sourceColumnId].findIndex((task) => task.id === active.id);
            const targetIndex = newTasks[destinationColumnId].findIndex((task) => task.id === over.id);

            newTasks[sourceColumnId] = newTasks[sourceColumnId].filter((task) => task.id !== active.id);

            if (!newTasks[destinationColumnId].some((task) => task.id === active.id)) {
                if (sourceColumnId === destinationColumnId) {
                    newTasks[destinationColumnId].splice(
                        movingTaskIndex < targetIndex ? targetIndex : targetIndex,
                        0,
                        activeTask,
                    );
                } else {
                    newTasks[destinationColumnId].splice(targetIndex, 0, activeTask);
                }
            }

            return newTasks;
        });
    }

    function handleStart(event) {
        const { active } = event;
        setActiveId(active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (over) {
            const newColumnId = Object.keys(tasks).find((columnId) =>
                tasks[columnId].find((task) => task.id === active.id),
            );

            if (!newColumnId) {
                setActiveId(null);
                return;
            }

            updateBoardStatus(active.id, newColumnId, isPrivileged(user.role));
            updateStatus(active.id, newColumnId);
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
        <Container disableGutters sx={{ width: "100%", height: "100%" }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragStart={handleStart}
            >
                <Grid container direction="row" sx={{ width: "100%", height: "100%" }}>
                    <Grid item>
                        <UnassignedColumn
                            id={"UNASSIGNED"}
                            title="Unassigned statuses"
                            tasks={(tasks && tasks["UNASSIGNED"]) || []}
                            activeId={activeId}
                            isOverlayActive={activeId && columns.some((column) => column.statusIds.includes(activeId))}
                        />
                    </Grid>
                    <Grid item style={{ overflowX: "auto", flex: 1 }}>
                        <Grid container direction="row" wrap="nowrap" spacing={-1}>
                            {workflowColumns.map((column) => (
                                <Grid key={column.id} item>
                                    <Column
                                        id={column.id}
                                        title={column.name}
                                        tasks={(tasks && tasks[column.id]) || []}
                                        activeId={activeId}
                                        handleRenameColumn={handleRenameColumn}
                                        isOverlayActive={activeId && !column.statusIds.includes(activeId)}
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
