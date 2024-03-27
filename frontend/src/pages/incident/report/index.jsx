import { useEffect, useState } from "react";
import {Button, Typography} from "@mui/material";
import IncidentDataGrid from "../../../components/incident/IncidentDataGrid";
import useTasks from "../../../hooks/useTasks";
import Profile from "../../../components/users/Profile";
import IncidentDetailModal from "../../../components/incident/IncidentDetailModal";
import { useBoard } from "../../../context/BoardContext";
import AddTaskModal from "../../../components/incident/AddTaskModal";
import useForm from "../../../hooks/useForm";
import useAxios from "../../../hooks/useAxios";
import { useAuthContext } from "../../../context/AuthContext";

function IncidentReport() {
    const { tasks, filterTasks, setTasks, fetchTasks } =
    useTasks();
    const [rows, setRows] = useState(Object.values(tasks).flat());
    const { user } = useAuthContext();
    const [ selectedIncident, setSelectedIncident] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { statuses } = useBoard();
    const { sendRequest } = useAxios();

    const styles = {
        styleHeader: {
            backgroundColor: 'red'
        },
    };

    const columns = [
        { field: "incidentDate", headerName: "Incident Date", width: 150, flex: 1, headerClassName: styles.styleHeader},
        { field: "incidentCategory", headerName: "Incident Category", width: 300, flex: 1},
        {
            field: "reporter",
            headerName: "Reporter",
            width: 200, flex: 1,
            renderCell: (params) => <Profile user={params.value} />,
        },
        {
            field: "statusId",
            headerName: "Status",
            width: 400, flex: 1,
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
        setRows(Object.values(tasks).flat());
    }, [tasks]);


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
          if (
            Object.prototype.hasOwnProperty.call(task, key) &&
            !directMapping[key]
          ) {
            incident.customFields.push({
              fieldName: key,
              value: task[key],
            });
          }
        }
        await sendRequest({ url: "/incidents", method: "POST", body: incident });
        fetchTasks();
    };

    const {forms, fetchForms, groupedByRows, sortedRows} = useForm();
    const [fields, setFields] = useState({});
    useEffect(() => {
        fetchForms();
    }, []);

    useEffect(() => {
        // TODO: remove this when the form is selected from the form list
        setFields(forms["GZ4tf8bErd3rZ9YizFOu"]?.fields);
    }, [forms]);

    const handleSort = () => {
        return sortedRows(groupedByRows(fields));
    };
    
    return (
        <>
            <AddTaskModal
                open={addModal}
                onClose={toggleAddModal}
                handleAddTask={handleAddTask}
                field={fields}
                sortedRows={handleSort}
            />
            <Typography variant="h4" component="h4"
                        style={{ fontFamily: "ITC Charter", marginLeft: "3rem", fontWeight: "bold",
                        marginTop: "1.8rem", color: "#2D2D2D"}}>
                Incident Reports
            </Typography>
            <div style={{marginRight:"3rem", marginLeft: "3rem"}}>
                <div style={{display: "flex", justifyContent: 'flex-end'}}>
                    <Button variant="contained" onClick={toggleAddModal}
                    style={{display: 'flex', justifyContent: 'flex-end', marginBottom: "1rem",
                        fontWeight: "bold"}}>
                        Add Incident
                    </Button>
                </div>
                <IncidentDataGrid rows={rows} columns={columns} onRowClick={handleRowClick}/>
                    {isModalOpen && selectedIncident && (
                        <IncidentDetailModal open={isModalOpen} selectedIncident={selectedIncident} incidentId={selectedIncident.id} onClose={handleCloseModal} />
                    )}
            </div>
        </>
    );
}

export default IncidentReport;
