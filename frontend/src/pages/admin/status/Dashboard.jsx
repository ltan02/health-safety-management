import { useEffect, useState } from "react";
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

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function Dashboard({ columns, updateBoardStatus, boardId, view }) {
    const [tasks, setTasks] = useState(deepCopy(columns));
    const [activeTask, setActiveTask] = useState(null);
    const sensors = useSensors(useSensor(PointerSensor));
    const dropAnimation = {
        ...defaultDropAnimation,
    };
    const { sendRequest } = useAxios();

    function handleRenameColumn(columnId, name) {
        const newColumns = tasks.map((column) => {
            if (column.id === columnId) {
                column.title = name;
            }
            return column;
        });
        setTasks(newColumns);
    }

    const updateStatus = async (statusId, toColumnId) => {
        sendRequest({
            url: `/boards/${boardId}/status/${statusId}`,
            method: "POST",
            body: { type: view === "ADMIN" ? "ADMIN" : "EMPLOYEE", toColumnId },
        });
    };

    function handleDragOver(event) {
        const { active, over } = event;
        if (!over) return;

        const sourceColumnId = columns.find((column) => column.statusIds.includes(active.id)).id;

        let destinationColumnId;
        if (!tasks.some((column) => column.statusIds.includes(over.id))) {
            destinationColumnId = over.id;
        } else {
            destinationColumnId = tasks.find((column) => column.statusIds.includes(over.id)).id;
        }

        if (!sourceColumnId || !destinationColumnId) {
            return;
        }

        setTasks((prevTasks) => {
            const newTasks = [...prevTasks];
            const movingTaskIndex = columns
                .find((column) => column.id === sourceColumnId)
                .statuses.findIndex((status) => status.id === active.id);
            const targetIndex = tasks
                .find((column) => column.id === destinationColumnId)
                .statuses.findIndex((status) => status.id === over.id);

            newTasks.find((column) => column.id === sourceColumnId).statuses = newTasks
                .find((column) => column.id === sourceColumnId)
                .statuses.filter((task) => task.id !== active.id);
            newTasks.find((column) => column.id === sourceColumnId).statusIds = newTasks
                .find((column) => column.id === sourceColumnId)
                .statusIds.filter((id) => id !== active.id);

            if (
                !newTasks
                    .find((column) => column.id === destinationColumnId)
                    .statuses.some((task) => task.id === active.id)
            ) {
                if (sourceColumnId === destinationColumnId) {
                    newTasks
                        .find((column) => column.id === destinationColumnId)
                        .statuses.splice(movingTaskIndex < targetIndex ? targetIndex : targetIndex, 0, activeTask);
                    newTasks
                        .find((column) => column.id === destinationColumnId)
                        .statusIds.splice(movingTaskIndex < targetIndex ? targetIndex : targetIndex, 0, activeTask.id);
                } else {
                    newTasks
                        .find((column) => column.id === destinationColumnId)
                        .statuses.splice(targetIndex, 0, activeTask);
                    newTasks
                        .find((column) => column.id === destinationColumnId)
                        .statusIds.splice(targetIndex, 0, activeTask.id);
                }
            }

            return newTasks;
        });
    }

    function handleStart(event) {
        const { active } = event;
        setActiveTask(
            tasks
                .find((column) => column.statusIds.includes(active.id))
                .statuses.find((status) => status.id === active.id),
        );
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (over) {
            let toColumnId = over.id;
            if (!columns.some((column) => column.id === toColumnId)) {
                toColumnId = tasks.find((column) => column.statusIds.includes(toColumnId)).id;
            }

            const sourceColumnId = columns.find((column) => column.statusIds.includes(active.id)).id;

            if (sourceColumnId !== toColumnId) {
                updateStatus(active.id, toColumnId);
            }

            updateBoardStatus(active.id, toColumnId, view === "ADMIN");
        }

        setActiveTask(null);
    }

    useEffect(() => {
        setTasks(deepCopy(columns));
    }, [columns]);

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
                            id="UNASSIGNED"
                            title="Unassigned statuses"
                            tasks={
                                (tasks && tasks.length > 0 && tasks.find((column) => column.id === "UNASSIGNED"))
                                    .statuses || []
                            }
                            activeId={activeTask?.id ?? null}
                            isOverlayActive={
                                activeTask && columns.some((column) => column.statusIds.includes(activeTask.id))
                            }
                        />
                    </Grid>
                    <Grid item style={{ overflowX: "auto", flex: 1 }}>
                        <Grid container direction="row" wrap="nowrap" spacing={-1}>
                            {tasks
                                .filter((column) => column.id !== "UNASSIGNED")
                                .map((column) => (
                                    <Grid key={column.id} item>
                                        <Column
                                            id={column.id}
                                            title={column.name}
                                            tasks={(tasks && column.statuses) || []}
                                            activeId={activeTask?.id ?? null}
                                            handleRenameColumn={handleRenameColumn}
                                            isOverlayActive={
                                                activeTask &&
                                                !columns
                                                    .find((c) => c.id === column.id)
                                                    .statusIds.includes(activeTask.id)
                                            }
                                        />
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>
                </Grid>
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeTask && <Task id={activeTask.id} task={activeTask} />}
                </DragOverlay>
            </DndContext>
        </Container>
    );
}

export default Dashboard;
