import { useEffect, useState } from "react";
import {Button, Typography} from "@mui/material";
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

    return (
        <>
            <Typography variant="h4" component="h4"
                        style={{ fontFamily: "ITC Charter", marginLeft: "3rem", fontWeight: "bold",
                        marginTop: "1.8rem", color: "#2D2D2D"}}>
                Incident Reports
            </Typography>
            <div style={{marginRight:"3rem", marginLeft: "3rem"}}>
                <div style={{display: "flex", justifyContent: 'flex-end'}}>
                    <Button variant="contained" onClick={() => {}}
                    style={{display: 'flex', justifyContent: 'flex-end', marginBottom: "1rem",
                        fontWeight: "bold"}}>
                        Add Incident
                    </Button>
                </div>
                <IncidentDataGrid rows={rows} columns={columns} onRowClick={handleRowClick}/>
                    {isModalOpen && (
                        <IncidentDetailModal open={isModalOpen} incidentId={selectedIncident.id} onClose={handleCloseModal} />
                    )}
            </div>
        </>
    );
}

export default IncidentReport;
