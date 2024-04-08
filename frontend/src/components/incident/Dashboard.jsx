import { useState, useEffect, useRef } from "react";
import { Container, Box, Button, Input, CircularProgress } from "@mui/material";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimation,
    rectIntersection,
} from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import Column from "./Column";
import Task from "./Task";
import useTasks from "../../hooks/useTasks";
import useDragBehavior from "../../hooks/useDragBehavior";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions";
import useAxios from "../../hooks/useAxios";
import { useBoard } from "../../context/BoardContext";
import useForm from "../../hooks/useForm";
import AddTaskModal from "./AddTaskModal.jsx";
import { useWorkflowNew } from "../../context/WorkflowContext";
import IncidentDetailModal from "./IncidentDetailModal";
import useAutoScroll from "../../hooks/useAutoScroll";
import useWorkflow from "../../hooks/useWorkflow.js";

function Dashboard({ setViewModalOpen }) {
    const { filteredTasks, filterTasks, setFilteredTasks, fetchTasks, loading } = useTasks();

    const { forms, fetchForms, groupedByRows, sortedRows, activeForm } = useForm();
    const { activeId, handleDragStart, handleDragEnd, setActiveId } = useDragBehavior(filteredTasks, setFilteredTasks);
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();
    const { adminColumns, employeeColumns, statuses } = useBoard();
    const [fields, setFields] = useState({});
    const [commentData, setCommentData] = useState({});
    const [columnFlowMap, setColumnFlowMap] = useState({});
    const { flowMap, activeStateMap, activeTransitionMap } = useWorkflowNew();
    const { states, transitions, fetchWorkflow } = useWorkflow();

    const [employees, setEmployees] = useState([]);
    const [addModal, setAddModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);

    const unsortedColumns = isPrivileged(user.role) ? adminColumns : employeeColumns;
    const columns = unsortedColumns.filter((column) => column.id !== "UNASSIGNED").sort((a, b) => a.order - b.order);

    const containerRef = useRef(null);

    useAutoScroll(containerRef, Boolean(activeId));
    const activeTask = activeId
        ? Object.values(filteredTasks)
              .flat()
              .find((task) => task.id === activeId)
        : null;

    const handleOpenModal = (task) => {
        setActiveId(null);
        setSelectedIncident(task);
        setIsModalOpen(true);
    };

    const handleAddTask = async (task) => {
        const directMapping = {
            incidentDate: "incidentDate",
            category: "incidentCategory",
            employees_involved: "employeesInvolved",
        };

        const startId = states.find((state) => state.data.label === "START")?.id;
        const firstStateId = transitions.find((transition) => transition.source === startId)?.target;
        const statusId = activeStateMap[firstStateId]?.statusId;

        const incident = {
            reporter: user.id,
            incidentDate: task.incidentDate,
            incidentCategory: task.category,
            employeesInvolved: task.employees_involved,
            customFields: [],
            comments: [],
            statusId: statusId,
        };

        for (const key in task) {
            if (Object.prototype.hasOwnProperty.call(task, key) && !directMapping[key]) {
                incident.customFields.push({
                    fieldName: key,
                    value: task[key],
                });
            }
        }
        await sendRequest({ url: "/incidents", method: "POST", body: incident });
        fetchTasks();
    };

    const refreshDashboard = () => {
        fetchTasks();
    };

    const handleSort = () => {
        return sortedRows(groupedByRows(fields));
    };

    const handleComment = () => {
        const flatTasks = Object.values(filteredTasks).flat();
        const initialCommentData = { ...commentData }; // shallow copy
        if (flatTasks) {
            flatTasks.map((task) => {
                const newCommentData = initialCommentData;
                //since we do not have comment edit logic, if the size of the comments array is the same, we do not need to push the comment data
                //this prevent us from pushing the same comment data multiple times
                if (task.comments?.length === newCommentData[task.id]?.length) {
                    return;
                }
                task.comments.map((comment) => {
                    if (!newCommentData[comment.id]) {
                        newCommentData[comment.id] = [];
                    }
                    const data = {
                        id: uuidv4(),
                        comment,
                        user: employees.filter((employee) => employee.id === comment.userId)[0],
                    };
                    const tempId = hasTempComment(newCommentData[comment.id], data);
                    if (tempId) {
                        newCommentData[comment.id][tempId] = data;
                    } else {
                        newCommentData[comment.id].push(data);
                    }
                });
                initialCommentData[task.id] = newCommentData[task.id];
            });
        }
        setCommentData(initialCommentData);
    };

    const hasTempComment = (commentData, newComment) => {
        const commentDataCopy = [...commentData];
        let tempId = null;
        commentDataCopy.map((data) => {
            if (data.id.includes("temp") && data.comment.content === newComment.comment.content) {
                tempId = data.id;
                return;
            }
        });
        return tempId;
    };

    const toggleAddModal = () => setAddModal(!addModal);

    useEffect(() => {
        const fetchEmployees = async () => {
            const res = await sendRequest({ url: "/users" });
            setEmployees(res);
        };
        fetchWorkflow();
        fetchForms();
        fetchEmployees();
    }, []);

    useEffect(() => {
        // TODO: remove this when the form is selected from the form list
        setFields(activeForm?.fields);
    }, [forms]);

    useEffect(() => {
        handleComment();
    }, [filteredTasks]);

    useEffect(() => {
        if (activeId) {
            setColumnFlowMap(() => {
                const newMap = {};

                const activeColumn = Object.keys(filteredTasks).find((column) =>
                    filteredTasks[column].some((task) => task.id === activeId),
                );
                const activeTask = filteredTasks[activeColumn].find((task) => task.id === activeId);

                flowMap[activeTask.statusId].forEach((item) => {
                    const toColumn = columns.find((column) =>
                        column.statusIds.includes(activeStateMap[item.toStateId].statusId),
                    );

                    if (!newMap[toColumn.id]) {
                        newMap[toColumn.id] = [];
                    }

                    newMap[toColumn.id].push({
                        transitionName: activeTransitionMap[item.transitionId]?.label,
                        statusName: statuses.find((status) => status.id === activeStateMap[item.toStateId].statusId)
                            ?.name,
                        statusId: activeStateMap[item.toStateId].statusId,
                        rules: activeTransitionMap[item.transitionId]?.rules || [],
                    });
                });

                return newMap;
            });
        }
    }, [activeId]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            window.mouseX = e.clientX;
            window.mouseY = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <Container maxWidth="false" disableGutters>
            <AddTaskModal
                open={addModal}
                onClose={toggleAddModal}
                handleAddTask={handleAddTask}
                field={fields}
                sortedRows={handleSort}
                formName={activeForm?.name}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                    marginLeft: "1rem",
                    marginRight: "1rem",
                    alignItems: "center",
                }}
            >
                <div>
                    <Input variant="outlined" placeholder="Search..." onChange={(e) => filterTasks(e.target.value)} />
                </div>
                {!loading && (
                    <Button
                        variant="contained"
                        onClick={toggleAddModal}
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            fontWeight: "bold",
                        }}
                    >
                        Add Incident
                    </Button>
                )}
            </div>
            <DndContext
                sensors={useSensors(
                    useSensor(PointerSensor, {
                        activationConstraint: {
                            distance: 4,
                        },
                    }),
                )}
                collisionDetection={rectIntersection}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
            >
                <Box
                    ref={containerRef}
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        gap: 2,
                        p: 2,
                        minHeight: "calc(100vh - 200px)",
                        alignItems: "stretch",
                    }}
                >
                    {columns.map((column) => (
                        <Box
                            key={column.id}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <Column
                                id={column.id}
                                title={column.name}
                                tasks={filteredTasks[column.id] || []}
                                filteredTasks={filteredTasks}
                                activeId={activeId}
                                handleAddTask={handleAddTask}
                                employees={employees}
                                onRefresh={refreshDashboard}
                                field={fields}
                                sortedRows={handleSort}
                                formName={activeForm?.name}
                                commentData={commentData}
                                columnMap={columnFlowMap[column.id]}
                                setFilteredTasks={setFilteredTasks}
                                handleOpenModal={handleOpenModal}
                                loading={loading}
                                sendRequest={sendRequest}
                            />
                        </Box>
                    ))}
                </Box>
                <DragOverlay dropAnimation={defaultDropAnimation}>
                    {activeTask && (
                        <Task
                            id={activeId}
                            task={activeTask}
                            onRefresh={refreshDashboard}
                            setTasks={setFilteredTasks}
                            handleOpenModal={handleOpenModal}
                        />
                    )}
                </DragOverlay>
            </DndContext>
            {isModalOpen && (
                <IncidentDetailModal
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        refreshDashboard();
                    }}
                    onRefresh={refreshDashboard}
                    selectedIncident={selectedIncident}
                    commentData={commentData}
                    setCommentData={setCommentData}
                    setTasks={setFilteredTasks}
                    transitions={transitions}
                    setViewModalOpen={setViewModalOpen}
                />
            )}
            {loading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1500,
                        pointerEvents: "none",
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </Container>
    );
}

export default Dashboard;
