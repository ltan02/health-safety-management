import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import IncidentDataGrid from "../../../components/incident/IncidentDataGrid";
import useTasks from "../../../hooks/useTasks";
import { isPrivileged } from "../../../utils/permissions";
import { useAuthContext } from "../../../context/AuthContext";
import Profile from "../../../components/users/Profile";
import { ADMIN_COLUMNS, EMPLOYEE_COLUMNS } from "../../../constants/board";
import IncidentDetailModal from "../../../components/incident/IncidentDetailModal";

function IncidentReport() {
    const { tasks } = useTasks();
    const { user } = useAuthContext();
    const [rows, setRows] = useState(Object.values(tasks).flat());
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const statusField = isPrivileged(user.role) ? "safetyWardenIncidentStatus" : "employeeIncidentStatus";
    const status = isPrivileged(user.role) ? ADMIN_COLUMNS : EMPLOYEE_COLUMNS;
    const statusTitleLookup = status.reduce((acc, status) => {
        acc[status.id] = status.title;
        return acc;
    }, {});

    const columns = [
        { field: "incidentDate", headerName: "Incident Date", width: 150 },
        { field: "incidentCategory", headerName: "Incident Category", width: 300 },
        {
            field: "reporter",
            headerName: "Reporter",
            width: 200,
            renderCell: (params) => <Profile user={params.value} />,
        },
        {
            field: statusField,
            headerName: "Status",
            width: 400,
            renderCell: (params) => statusTitleLookup[params.value] || "Unknown Status",
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

    return (
        <>
            <Button variant="contained" onClick={() => {}}>
                Add Incident
            </Button>
            <IncidentDataGrid rows={rows} columns={columns} onRowClick={handleRowClick} />
            {isModalOpen && (
                <IncidentDetailModal open={isModalOpen} incidentId={selectedIncident.id} onClose={handleCloseModal} />
            )}
        </>
    );
}

export default IncidentReport;
