import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import IncidentDataGrid from "../../../components/incident/IncidentDataGrid";
import useTasks from "../../../hooks/useTasks";
import Profile from "../../../components/users/Profile";
import IncidentDetailModal from "../../../components/incident/IncidentDetailModal";
import { useBoard } from "../../../context/BoardContext";
import AddTaskModal from "../../../components/incident/AddTaskModal";
import useForm from "../../../hooks/useForm";
import useAxios from "../../../hooks/useAxios";
import { useAuthContext } from "../../../context/AuthContext";
import { useWorkflowNew } from "../../../context/WorkflowContext";
import useWorkflow from "../../../hooks/useWorkflow";
import ViewWorkflowModal from "../../../components/workflows/ViewWorkflowModal";
import AdminManagement from "../../admin/management";
import LoadingBar from "../../../components/global/LoadingBar";
import {v4 as uuidv4} from "uuid";

function IncidentReport() {
    const { filteredTasks, fetchTasks, setFilteredTasks, loading } = useTasks();
    const [rows, setRows] = useState(Object.values(filteredTasks).flat());
    const { user } = useAuthContext();
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { statuses } = useBoard();
    const { sendRequest } = useAxios();
    const { transitions, fetchWorkflow } = useWorkflow();
    const { fetchWorkflowNew } = useWorkflowNew();

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleView = async () => {
        setEditModalOpen(true);
        setViewModalOpen(false);
    };

    useEffect(() => {
        fetchWorkflow();
        fetchWorkflowNew();
    }, []);
    const [commentData, setCommentData] = useState({});
    const [employees, setEmployees] = useState([]);


    const styles = {
        styleHeader: {
            backgroundColor: "red",
        },
    };

    const columns = [
        {
            field: "incidentDate",
            headerName: "Incident Date",
            width: 150,
            flex: 1,
            headerClassName: styles.styleHeader,
        },
        { field: "incidentCategory", headerName: "Incident Category", width: 300, flex: 1 },
        {
            field: "reporter",
            headerName: "Reporter",
            width: 200,
            flex: 1,
            renderCell: (params) => <Profile user={params.value} />,
        },
        {
            field: "statusId",
            headerName: "Status",
            width: 400,
            flex: 1,
            renderCell: (params) => statuses.find((status) => status.id === params.value)?.name ?? "Unknown Status",
        },
    ];

    const handleRowClick = (params) => {
        setSelectedIncident(params.row);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedIncident(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        setRows(Object.values(filteredTasks).flat());
    }, [filteredTasks]);

    useEffect(() => {
        fetchWorkflow();
    }, []);

    const [addModal, setAddModal] = useState(false);
    const toggleAddModal = () => setAddModal(!addModal);

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

    const { forms, fetchForms, groupedByRows, sortedRows, activeForm } = useForm();
    const [fields, setFields] = useState({});
    useEffect(() => {
        fetchForms();
    }, []);

    useEffect(() => {
        setFields(activeForm?.fields);
    }, [forms]);

    const handleSort = () => {
        return sortedRows(groupedByRows(fields));
    };

    const handleComment = () => {
        const flatTasks = Object.values(filteredTasks).flat();
        const initialCommentData = { ...commentData }; // shallow copy
        if (flatTasks) {
            flatTasks.map((task) => {
                const newCommentData = initialCommentData;
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
                    // this is to prevent duplicate temp comments
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

    useEffect(() => {
        const fetchEmployees = async () => {
            const res = await sendRequest({ url: "/users" });
            setEmployees(res);
        };
        fetchForms();
        fetchEmployees();
    }, []);

    useEffect(() => {
        handleComment();
    }, [filteredTasks]);

    return (
        <>
            <AddTaskModal
                open={addModal}
                onClose={toggleAddModal}
                handleAddTask={handleAddTask}
                field={fields}
                sortedRows={handleSort}
                formName={activeForm?.name}
            />
            <Typography
                variant="h4"
                component="h4"
                style={{
                    fontFamily: "ITC Charter",
                    marginLeft: "3rem",
                    fontWeight: "bold",
                    marginTop: "1.8rem",
                    color: "#2D2D2D",
                }}
            >
                Incident Reports
            </Typography>
            <div style={{ marginRight: "3rem", marginLeft: "3rem" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {!loading && (
                        <Button
                            variant="contained"
                            onClick={toggleAddModal}
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: "1rem",
                                fontWeight: "bold",
                            }}
                        >
                            Add Incident
                        </Button>
                    )}
                </div>
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

                {!loading && <IncidentDataGrid rows={rows} columns={columns} onRowClick={handleRowClick} />}
                {isModalOpen && selectedIncident && (
                    <IncidentDetailModal
                        open={isModalOpen}
                        selectedIncident={selectedIncident}
                        incidentId={selectedIncident.id}
                        onClose={handleCloseModal}
                        setTasks={setFilteredTasks}
                        transitions={transitions}
                        setViewModalOpen={setViewModalOpen}
                    />
                )}
            </div>
            {viewModalOpen && (
                <ViewWorkflowModal
                    open={viewModalOpen}
                    handleClose={() => {
                        setViewModalOpen(false);
                    }}
                    handleEdit={handleView}
                />
            )}
            {editModalOpen && <AdminManagement open={editModalOpen} handleClose={() => setEditModalOpen(false)} />}
        </>
    );
}

export default IncidentReport;
