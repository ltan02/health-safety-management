import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import IncidentDataGrid from "../../../components/incident/IncidentDataGrid";
import useTasks from "../../../hooks/useTasks";
import Profile from "../../../components/users/Profile";
import IncidentDetailModal from "../../../components/incident/IncidentDetailModal";
import { useBoard } from "../../../context/BoardContext";

function IncidentReport() {
    const { tasks } = useTasks();
    const [rows, setRows] = useState(Object.values(tasks).flat());
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { statuses } = useBoard();

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
            field: "statusId",
            headerName: "Status",
            width: 400,
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
