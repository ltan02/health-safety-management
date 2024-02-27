import { useState, useEffect, Fragment } from "react";
import {
    Modal,
    Box,
    Typography,
    CardContent,
    Select,
    MenuItem,
    IconButton,
    Grid,
    Avatar,
    TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useAxios from "../../hooks/useAxios";
import { useAuthContext } from "../../context/AuthContext";
import { isPrivileged } from "../../utils/permissions";
import { ADMIN_COLUMNS, EMPLOYEE_COLUMNS } from "../../constants/board";
import { formatCamelCaseToNormalText } from "../../utils/textFormat";
import Profile from "../users/Profile";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    maxHeight: "80vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

export default function IncidentDetailModal({ incidentId, open, onClose }) {
    const { sendRequest } = useAxios();
    const { user } = useAuthContext();

    const [incident, setIncident] = useState(null);
    const [incidentState, setIncidentState] = useState(null);

    const possibleStates = isPrivileged(user.role) ? ADMIN_COLUMNS : EMPLOYEE_COLUMNS;
    const statusField = isPrivileged(user.role) ? "safetyWardenIncidentStatus" : "employeeIncidentStatus";

    useEffect(() => {
        const fetchData = async () => {
            const res = await sendRequest({
                url: `/incidents/${incidentId}`,
            });

            res.employeesInvolved = [...new Set([...res.employeesInvolved])].filter((id) => id !== res.reporter);

            const userIds = [...new Set([res.reporter, ...res.employeesInvolved])];
            const users = await Promise.all(userIds.map((id) => sendRequest({ url: `/users/${id}` })));

            const userMap = users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});

            const updatedIncident = {
                ...res,
                reporter: userMap[res.reporter],
                employeesInvolved: res.employeesInvolved.map((id) => userMap[id]),
            };

            setIncident(updatedIncident);
            setIncidentState(updatedIncident[statusField]);
        };

        fetchData();
    }, []);

    if (!incident) return <></>;

    const handleStateChange = async (event) => {
        const newStateId = event.target.value;

        sendRequest({
            url: `/incidents/${incidentId}`,
            method: "POST",
            body: {
                [statusField]: newStateId,
            },
        });

        setIncident((prevIncident) => {
            const newIncident = {
                ...prevIncident,
                [statusField]: newStateId,
            };
            return newIncident;
        });
        setIncidentState(newStateId);
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="issue-detail-modal" aria-describedby="issue-details">
            <Box sx={modalStyle}>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "flex-end",
                    }}
                >
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "60%",
                        }}
                    >
                        <Typography id="issue-detail-modal-title" variant="h4" component="h2">
                            {`${incident.incidentCategory} on ${incident.incidentDate}`}
                        </Typography>
                        {Object.keys(incident?.customFields ?? {}).map((fieldName) => {
                            return (
                                <Fragment key={fieldName}>
                                    <Typography sx={{ mt: 2, mb: 0.5, fontWeight: 600 }}>
                                        {formatCamelCaseToNormalText(fieldName)}
                                    </Typography>
                                    <Typography variant="body2">{incident.customFields[fieldName]}</Typography>
                                </Fragment>
                            );
                        })}
                        <Typography sx={{ mt: 2, mb: 0.5, fontWeight: 600 }}>Comments</Typography>
                        <Box sx={{ display: "flex", mt: 2, gap: 2, width: "100%", alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: "blue", width: "30px", height: "30px", fontSize: "14px" }}>
                                {`${user.firstName[0]}${user.lastName[0]}`}
                            </Avatar>
                            <TextareaAutosize
                                minRows={1}
                                maxRows={4}
                                placeholder="Add a comment..."
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    textAlign: "start",
                                    border: "none",
                                    resize: "none",
                                    outline: "none",
                                    borderRadius: "4px",
                                    lineHeight: "20px",
                                }}
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "40%",
                            alignItems: "flex-start",
                            rowGap: 2,
                        }}
                    >
                        <Select
                            value={incidentState ?? ""}
                            onChange={handleStateChange}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            sx={{
                                backgroundColor: "#f1f2f4",
                                border: "none",
                                borderRadius: "5px",
                                "&:hover": {
                                    backgroundColor: "#dddfe5",
                                },
                                ".MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                },
                            }}
                        >
                            {possibleStates.map(({ id, title }) => {
                                return (
                                    <MenuItem key={id} value={id}>
                                        {title}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <Box
                            sx={{
                                border: 1,
                                borderRadius: "5px",
                                width: "100%",
                            }}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    borderBottom: 1,
                                    fontSize: "16px",
                                }}
                            >
                                Details
                            </Box>
                            <Box sx={{ mt: 2, px: 2, pb: 2 }}>
                                <Grid container spacing={2} sx={{ rowGap: 2 }}>
                                    <Grid item xs={6}>
                                        <Typography>Category</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {incident && <Typography>{incident.incidentCategory}</Typography>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Reporter</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {incident && <Profile user={incident.reporter} />}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Employees Involved</Typography>
                                    </Grid>
                                    <Grid item xs={6} sx={{ rowGap: 1 }}>
                                        {incident &&
                                            incident.employeesInvolved
                                                .filter((employee) => employee.id !== incident.reporter.id)
                                                .map((employee) => {
                                                    return (
                                                        <Box key={employee.id} sx={{ mb: 1.5 }}>
                                                            <Profile user={employee} />
                                                        </Box>
                                                    );
                                                })}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
