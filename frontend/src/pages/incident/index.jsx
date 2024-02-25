import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import IncidentModal from "../../components/incident/IncidentModal";
import IncidentDataGrid from "../../components/incident/IncidentDataGrid";
import useAxios from "../../hooks/useAxios";

function Incident({ fields }) {
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const { sendRequest } = useAxios();

    useEffect(() => {
        const fetchData = async () => {
            const incidents = await sendRequest({ url: "/incidents" });
            
            const userIds = [...new Set(incidents.flatMap(incident => [incident.reporter, ...incident.employeesInvolved]))];
            
            const userPromises = userIds.map(id => sendRequest({ url: `/users/${id}` }));
            const users = await Promise.all(userPromises);
            const userMap = users.reduce((acc, user) => {
                acc[user.id] = `${user.firstName} ${user.lastName}`;
                return acc;
            }, {});

            const incidentsWithNames = incidents.map(incident => ({
                ...incident,
                id: incident.id,
                reporter: userMap[incident.reporter],
                employeesInvolved: incident.employeesInvolved.map(e => userMap[e]).join(", "),
            }));

            setRows(incidentsWithNames);
        };

        fetchData();
    }, []);

    const [selectedRows, setSelectedRows] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSelectionModelChange = (newSelection) => {
        setSelectedRows(newSelection);
    };
    const deleteSelectedRows = () => {
        const newRows = rows.filter((row) => !selectedRows.includes(row.id));
        setRows(newRows);
    };

    const handleSubmit = (newRow) => {
        setRows([...rows, newRow]);
        handleClose();
    };

    return (
        <>
            <Button onClick={handleOpen}>Add</Button>
            <IncidentModal open={open} onClose={handleClose} onSubmit={handleSubmit} fields={fields} />
            <Button onClick={deleteSelectedRows} disabled={selectedRows.length === 0}>
                Remove
            </Button>
            <IncidentDataGrid rows={rows} onSelectionModelChange={handleSelectionModelChange} fields={fields} />
        </>
    );
}

export default Incident;
