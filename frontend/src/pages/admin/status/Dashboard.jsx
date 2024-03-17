import { useEffect, useState, useRef } from "react";
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimation,
} from "@dnd-kit/core";
import { Button, Container, Grid, Box, Typography, InputBase, ClickAwayListener } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { styled, alpha } from "@mui/material/styles";
import Column from "./Column";
import Task from "./Task";
import UnassignedColumn from "./UnassignedColumn";
import useAxios from "../../../hooks/useAxios";

const AddButton = styled(Button)(({ theme }) => ({
    minWidth: "32px",
    width: "32px",
    height: "32px",
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
    padding: 0,
    position: "relative",
}));

const CreateColumnBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    right: "calc(100% + 8px)",
    top: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    p: 2,
    borderRadius: 1,
    zIndex: 2,
    backgroundColor: "#44556f",
    whiteSpace: "nowrap",
    opacity: 0,
    transition: "opacity 0.1s ease-in-out 0.8s",
    width: "auto",
    minWidth: "90px",
}));

const NewColumnInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
        marginTop: 0,
    },
    "& .MuiInputBase-input": {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
        border: "1px solid",
        borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
        fontSize: 16,
        width: "auto",
        padding: "10px 12px",
        transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
        "&:focus": {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}));

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function Dashboard({ columns, updateBoardStatus, boardId, view, addColumn, deleteColumn }) {
    const [tasks, setTasks] = useState(deepCopy(columns));
    const [activeTask, setActiveTask] = useState(null);
    const [showCreateColumn, setShowCreateColumn] = useState(false);
    const [createNewColumn, setCreateNewColumn] = useState(false);
    const [columnName, setColumnName] = useState("");
    const sensors = useSensors(useSensor(PointerSensor));
    const dropAnimation = {
        ...defaultDropAnimation,
    };
    const { sendRequest } = useAxios();
    const containerRef = useRef(null);
    const inputRef = useRef(null);

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
        await sendRequest({
            url: `/boards/${boardId}/status/${statusId}`,
            method: "POST",
            body: { type: view === "ADMIN" ? "ADMIN" : "EMPLOYEE", toColumnId },
        });
    };

    const handleDeleteColumn = async (columnId) => {
        deleteColumn(columnId, view === "ADMIN");
        await sendRequest({
            url: `/boards/${boardId}/columns/${columnId}`,
            method: "DELETE",
            body: { boardType: view === "ADMIN" ? "ADMIN" : "EMPLOYEE" },
        });
        await sendRequest({
            url: `/columns/${columnId}`,
            method: "DELETE",
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

    const handleCreateNewColumn = () => {
        setCreateNewColumn(true);
        setShowCreateColumn(false);
        setColumnName("");
    };

    const handleClickAway = () => {
        setCreateNewColumn(false);
        setColumnName("");
    };

    const createColumn = async () => {
        const response = await sendRequest({
            url: "/columns",
            method: "POST",
            body: { name: columnName, order: columns.length - 1, statusIds: [] },
        });
        addColumn(response, view === "ADMIN");
        await sendRequest({ url: `/boards/${boardId}/columns/${response.id}`, method: "POST", body: { boardType: view } });

        setColumnName("");
        setCreateNewColumn(false);
    };

    const handleInputChange = (event) => {
        setColumnName(event.target.value);
    };

    useEffect(() => {
        if (createNewColumn && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: "auto", block: "nearest", inline: "start" });

            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [createNewColumn]);

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
                    <Grid item style={{ overflowX: "auto", flex: 1, display: "flex", alignItems: "start" }}>
                        <Grid
                            container
                            direction="row"
                            wrap="nowrap"
                            spacing={-1}
                            minHeight="220px"
                            sx={{ alignItems: "stretch" }}
                        >
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
                                            handleDeleteColumn={handleDeleteColumn}
                                        />
                                    </Grid>
                                ))}
                            {!createNewColumn && (
                                <div style={{ position: "relative" }}>
                                    <CreateColumnBox
                                        className="create-column"
                                        sx={{ opacity: showCreateColumn ? 1 : 0 }}
                                    >
                                        <Typography variant="button" color="white" sx={{ fontSize: "12px" }}>
                                            Create column
                                        </Typography>
                                    </CreateColumnBox>
                                    <AddButton
                                        onMouseEnter={() => setShowCreateColumn(true)}
                                        onMouseLeave={() => setShowCreateColumn(false)}
                                        onClick={handleCreateNewColumn}
                                    >
                                        <AddIcon color="secondary" sx={{ width: "28px", height: "32px" }} />
                                    </AddButton>
                                </div>
                            )}
                            {createNewColumn && (
                                <ClickAwayListener onClickAway={handleClickAway}>
                                    <Container
                                        ref={containerRef}
                                        sx={{
                                            position: "relative",
                                            bgcolor: "grey.200",
                                            padding: 2,
                                            borderRadius: 1,
                                            minHeight: "160px",
                                            height: "100%",
                                            width: "300px",
                                            marginY: 2,
                                            marginX: 1,
                                            boxShadow: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <NewColumnInput
                                            inputRef={inputRef}
                                            value={columnName}
                                            onChange={handleInputChange}
                                            autoFocus
                                            fullWidth
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "end",
                                                width: "auto",
                                                marginTop: 10,
                                            }}
                                        >
                                            <Button
                                                sx={{
                                                    minWidth: "32px",
                                                    width: "32px",
                                                    height: "32px",
                                                    backgroundColor: "white",
                                                    marginRight: 2,
                                                }}
                                                onClick={createColumn}
                                            >
                                                <CheckIcon />
                                            </Button>
                                            <Button
                                                sx={{
                                                    minWidth: "32px",
                                                    width: "32px",
                                                    height: "32px",
                                                    backgroundColor: "white",
                                                }}
                                                onClick={handleClickAway}
                                            >
                                                <CloseIcon />
                                            </Button>
                                        </div>
                                    </Container>
                                </ClickAwayListener>
                            )}
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
