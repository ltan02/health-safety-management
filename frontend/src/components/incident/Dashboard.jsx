import { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
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
import IncidentSearchInput from "./IncidentSearchInput";
import Task from "./Task";
import useTasks from "../../hooks/useTasks";
import useDragBehavior from "../../hooks/useDragBehavior";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions";
import useAxios from "../../hooks/useAxios";
import { useBoard } from "../../context/BoardContext";
import IncidentDetailModal from "./IncidentDetailModal";
import useForm from "../../hooks/useForm";
import { set } from "lodash";

const SELECTED_INCIDENT = "GZ4tf8bErd3rZ9YizFOu";
function Dashboard() {
    const { tasks, filterTasks, setTasks, fetchTasks } = useTasks();
    

    const { forms, fetchForms, groupedByRows, sortedRows } = useForm();
    const { activeId, handleDragStart, handleDragOver, handleDragEnd } = useDragBehavior(tasks, setTasks);
    const { user } = useAuthContext();
    const { sendRequest } = useAxios();
    const { adminColumns, employeeColumns, statuses } = useBoard();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [fields, setFields] = useState({});
    const [commentData, setCommentData] = useState({});

    const [employees, setEmployees] = useState([]);

    const unsortedColumns = isPrivileged(user.role) ? adminColumns : employeeColumns;
    const columns = unsortedColumns.filter((column) => column.id !== "UNASSIGNED").sort((a, b) => a.order - b.order);

    const activeTask = activeId
        ? Object.values(tasks)
              .flat()
              .find((task) => task.id === activeId)
        : null;

    const handleAddTask = async (task) => {
        const directMapping = {
            incidentDate: "incidentDate",
            category: "incidentCategory",
            employees_involved: "employeesInvolved",
        };

        const incident = {
            reporter: user.id,
            incidentDate: task.incidentDate,
            incidentCategory: task.category,
            employeesInvolved: task.employees_involved,
            customFields: [],
            comments: [],
            statusId: statuses.find((status) => status.name === "Pending Review")?.id,
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

    const handleOpenModal = (task) => {
        setIsModalOpen(true);
        setSelectedTask(task);
    };

    const handleSort = () => {
        return sortedRows(groupedByRows(fields));
    };

    const handleComment = () =>{
        const flatTasks = Object.values(tasks).flat()
        const initialCommentData = {...commentData} // shallow copy
        if(flatTasks) {
            flatTasks.map((task) => {
            const newCommentData = initialCommentData;
            task.comments.map((comment) => {
              if(!newCommentData[comment.id] ) {
                newCommentData[comment.id] = []
              }
              const data = {
                id: uuidv4(),
                comment,
                user: employees.filter((employee) =>
                    employee.id === comment.userId
                )[0]
              }
              const tempId = hasTempComment(newCommentData[comment.id], data)
              // this is to prevent duplicate temp comments
              if(tempId) {
                newCommentData[comment.id][tempId] = data
              } else {
                newCommentData[comment.id].push(data)
              }
            })

            initialCommentData[task.id] = newCommentData[task.id]
          })
        }
        setCommentData(initialCommentData)
      }

    const hasTempComment = (commentData, newComment) => {
        const commentDataCopy = [...commentData]
        let tempId = null
        commentDataCopy.map((data) => {
            if(data.id.includes("temp") && data.comment.content === newComment.comment.content){
                tempId = data.id
                return
            }
        })        
        return tempId
    }

    useEffect(() => {
        const fetchEmployees = async () => {
            const res = await sendRequest({ url: "/users" });
            setEmployees(res);
        };
        fetchForms();
        fetchEmployees();
    }, []);

    useEffect(() => {
        // TODO: remove this when the form is selected from the form list
        setFields(forms[SELECTED_INCIDENT]?.fields);
    }, [forms]);

    useEffect(() => {
        handleComment()
    }, [tasks]);


    return (
        <Container maxWidth="false" disableGutters>
            <IncidentSearchInput onSearch={filterTasks} handleOpenModal={handleOpenModal} />
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
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
            >
                <Box
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
                                tasks={tasks[column.id] || []}
                                activeId={activeId}
                                handleAddTask={handleAddTask}
                                employees={employees}
                                onRefresh={refreshDashboard}
                                field={fields}
                                sortedRows={handleSort}
                                formName={forms[SELECTED_INCIDENT]?.name}
                                commentData={commentData}
                                setCommentData={setCommentData}
                            />
                        </Box>
                    ))}
                </Box>
                <DragOverlay dropAnimation={defaultDropAnimation}>
                    {activeTask && <Task id={activeId} task={activeTask} onRefresh={refreshDashboard} />}
                </DragOverlay>
            </DndContext>
            {isModalOpen && selectedTask && (
                <IncidentDetailModal
                    incidentId={selectedTask.id}
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        refreshDashboard;
                    }}
                    commentData={commentData}
                    setCommentData={setCommentData}
                    onRefresh={refreshDashboard}
                    selectedIncident={selectedTask}
                />
            )}
        </Container>
    );
}

export default Dashboard;
