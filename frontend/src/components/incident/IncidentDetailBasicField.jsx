import { useState, useEffect } from "react";
import { Box, Typography, MenuItem, Grid, Menu, TextField, Divider, Button } from "@mui/material";
import { convertToPacificTime } from "../../utils/date";
import { dateToDaysAgo } from "../../utils/date";
import { isPrivileged } from "../../utils/permissions";
import Profile from "../users/Profile";
import EmployeesInvolveEditModal from "./EmployeesInvolveEditModal";
import { useWorkflowNew } from "../../context/WorkflowContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IncidentDateChangeModal from "./IncidentDateChangeModal";

const FIELD = {
    DATE: "date",
    CATEGORY: "category",
    REPORTER: "reporter",
    EMPLOYEES_INVOLVED: "employeesInvolved",
    REVIEWER: "reviewer",
};
export default function IncidentDetailBasicField({
    incident,
    reviewer,
    employees,
    user,
    handleStateChange,
    incidentState,
    handleOpenEmployeesListModal,
    openReviewer,
    openReporter,
    anchorEl,
    open,
    handleClose,
    handleSwitchReviewer,
    fetchEmployees,
    handleSwitchReporter,
    loading,
    statuses,
    setOpenReviewer,
    setOpenReporter,
    handleUpdateEmployeesInvolved,
    handleDateUpdate,
    transitions,
    setViewModalOpen,
}) {
    const [editingField, setEditingField] = useState(null);
    const [searchEmployee, setSearchEmployee] = useState("");
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [openEmployeesInolveModal, setOpenEmployeesInvolveModal] = useState(false);
    const [openDateChangeModal, setOpenDateChangeModal] = useState(false);
    const [currentField, setCurrentField] = useState({
        [FIELD.DATE]: incident?.incidentDate,
        [FIELD.CATEGORY]: incident?.incidentCategory,
        [FIELD.REPORTER]: incident?.reporter,
        [FIELD.EMPLOYEES_INVOLVED]: incident?.employeesInvolved,
        [FIELD.REVIEWER]: reviewer,
    });
    const [anchorElStatus, setAnchorElStatus] = useState(null);
    const openStatus = Boolean(anchorElStatus);

    const handleClickStatus = (event) => {
        setAnchorElStatus(event.currentTarget);
    };

    const handleCloseStatus = () => {
        setAnchorElStatus(null);
    };

    const { flowMap, activeStateMap, activeTransitionMap } = useWorkflowNew();

    const isValidRule = (rule) => {
        if (rule.type === "restrict-who-can-move-an-issue") {
            return rule.userIds.includes(user.id) || rule.roles.includes(user.role);
        }
        return true;
    };

    const handleClickField = (fieldName) => {
        setEditingField(fieldName);
    };

    const handleFilterEmployees = async (e) => {
        if (employees.length === 0) {
            await fetchEmployees();
        }
        setSearchEmployee(e.target.value);
        setFilteredEmployees(
            employees
                .filter(
                    (employee) =>
                        employee.firstName.toLowerCase().includes(e.target.value) ||
                        employee.lastName.toLowerCase().includes(e.target.value),
                )
                .filter(
                    (employee) =>
                        !(editingField === FIELD.REPORTER && employee.id === currentField[FIELD.REPORTER].id) &&
                        !(editingField === FIELD.REVIEWER && employee.id === currentField[FIELD.REVIEWER].id),
                ),
        );
    };

    const handleOpenInvolvedEmployees = () => {
        setEditingField(FIELD.EMPLOYEES_INVOLVED);
        // handleOpenEmployeesListModal({ e, privileged: false });
        setOpenEmployeesInvolveModal(true);
    };

    const handleAddEmployee = async (selectedEmployees) => {
        handleUpdateEmployeesInvolved(selectedEmployees);
    };

    const handleOpenReporter = (e) => {
        setOpenReviewer(false);
        setOpenReporter(true);
        setEditingField(FIELD.REPORTER);
        handleOpenEmployeesListModal({ e, privileged: false });
    };

    const handleOpenReviewer = (e) => {
        if (!isPrivileged(user.role)) return;
        setOpenReporter(false);
        setOpenReviewer(true);
        setEditingField(FIELD.REVIEWER);
        handleOpenEmployeesListModal({ e, privileged: true });
    };

    const handleOpenDateChange = () => {
        setEditingField(FIELD.DATE);
        setOpenDateChangeModal(true);
    };

    const handleSelectEmployee = (id) => {
        if (editingField === FIELD.REPORTER) {
            handleSwitchReporter(id);
        } else if (editingField === FIELD.REVIEWER) {
            handleSwitchReviewer(id);
        }
    };

    useEffect(() => {
        setCurrentField({
            [FIELD.DATE]: incident?.incidentDate,
            [FIELD.CATEGORY]: incident?.incidentCategory,
            [FIELD.REPORTER]: incident?.reporter,
            [FIELD.EMPLOYEES_INVOLVED]: incident?.employeesInvolved,
            [FIELD.REVIEWER]: reviewer,
        });
    }, [incident, reviewer, employees]);

    useEffect(() => {
        setFilteredEmployees(
            employees?.filter((employee) =>
                editingField === FIELD.REPORTER
                    ? employee.id !== currentField[FIELD.REPORTER]?.id
                    : editingField === FIELD.REVIEWER
                    ? employee.id !== currentField[FIELD.REVIEWER]?.id
                    : true,
            ),
        );
    }, [currentField]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "45%",
                alignItems: "flex-start",
                rowGap: 2,
                justifyContent: "space-between",
            }}
        >
            <Button
                id="status-button"
                aria-controls={openStatus ? "status-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openStatus ? "true" : undefined}
                onClick={handleClickStatus}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                    backgroundColor: "#f1f2f4",
                    border: "none",
                    height: "3rem",
                    borderRadius: "5px",
                    "&:hover": {
                        backgroundColor: "#dddfe5",
                    },
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "none",
                }}
            >
                {statuses.find((status) => status.id === incidentState)?.name || "Select Status"}
            </Button>
            <Menu
                id="status-menu"
                anchorEl={anchorElStatus}
                open={openStatus}
                onClose={handleCloseStatus}
                MenuListProps={{
                    "aria-labelledby": "status-button",
                }}
            >
                {(flowMap[incident?.statusId] ?? []).filter(({ transitionId }) =>
                    transitions
                        .find((transition) => transition.id === transitionId)
                        .data.rules.every((rule) => isValidRule(rule)),
                ).length === 0 ? (
                    <p style={{ padding: 15, fontSize: "14px", color: "#7D7D7D" }}>
                        You don&apos;t have permission to transition this issue
                    </p>
                ) : (
                    flowMap[incident?.statusId]
                        .filter(({ transitionId }) =>
                            transitions
                                .find((transition) => transition.id === transitionId)
                                .data.rules.every((rule) => isValidRule(rule)),
                        )
                        .map(({ toStateId, transitionId }) => (
                            <MenuItem
                                key={toStateId}
                                onClick={() => {
                                    handleStateChange(activeStateMap[toStateId]?.statusId);
                                    setAnchorElStatus(null);
                                    handleClose();
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        alignItems: "center",
                                    }}
                                >
                                    <p style={{ margin: 0, fontSize: 14 }}>
                                        {activeTransitionMap[transitionId]?.label}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <ArrowForwardIcon sx={{ width: "16px", height: "16px" }} />
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: 11,
                                                border: "1.5px solid #000",
                                                borderRadius: "4px",
                                                padding: "2px 6px",
                                                display: "inline-block",
                                            }}
                                        >
                                            {
                                                statuses.find(
                                                    (status) => status.id === activeStateMap[toStateId]?.statusId,
                                                )?.name
                                            }
                                        </p>
                                    </div>
                                </div>
                            </MenuItem>
                        ))
                )}
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={() => setViewModalOpen(true)}>View Workflow</MenuItem>
            </Menu>
            <Box
                sx={{
                    border: 1,
                    borderRadius: "5px",
                    borderColor: "#464646",
                    width: "100%",
                    height: "90%",
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        borderBottom: 1,
                        borderColor: "#464646",
                        fontSize: "16px",
                        fontWeight: "bold",
                        fontFamily: "Helvetica",
                        color: "secondary.main",
                    }}
                >
                    Details
                </Box>
                <Box sx={{ mt: 2, px: 2, pb: 2 }}>
                    <Grid container spacing={2} sx={{ rowGap: 1 }}>
                        <Grid item xs={6}>
                            <Typography fontWeight={"bold"} color={"secondary.main"}>
                                Date of Incident
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            {incident && (
                                <Typography
                                    fontSize={15}
                                    sx={{ "&:hover": { cursor: "pointer", color: "#EB8C00" } }}
                                    fontFamily="Helvetica"
                                    fontWeight={500}
                                    onClick={handleOpenDateChange}
                                >
                                    {incident.incidentDate}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={"bold"} color={"secondary.main"}>
                                Category
                            </Typography>
                        </Grid>
                        <Grid item xs={6} onClick={() => handleClickField(FIELD.CATEGORY)}>
                            {currentField[FIELD.CATEGORY] && (
                                <Typography sx={{ fontSize: "14px" }}>{currentField[FIELD.CATEGORY]}</Typography>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={"bold"} color={"secondary.main"}>
                                Reporter
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <Profile user={currentField[FIELD.REPORTER]} />
                                </Grid>
                                <Grid
                                    item
                                    sx={{
                                        fontSize: "14px",
                                        "&:hover": { cursor: "pointer", color: "#EB8C00" },
                                    }}
                                    onClick={(e) => handleOpenReporter(e)}
                                >
                                    {currentField[FIELD.REPORTER].firstName} {currentField[FIELD.REPORTER].lastName}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={"bold"} color={"secondary.main"}>
                                Employees Involved
                            </Typography>
                        </Grid>
                        <Grid item xs={6} onClick={(e) => handleOpenInvolvedEmployees(e)}>
                            {incident &&
                                currentField[FIELD.EMPLOYEES_INVOLVED]
                                    //   .filter(
                                    //     (employee) =>
                                    //       employee.id !== currentField[FIELD.REPORTER].id
                                    //   )
                                    .map((employee) => {
                                        return (
                                            <Grid
                                                container
                                                spacing={1}
                                                alignItems="center"
                                                key={employee.id}
                                                paddingBottom={1}
                                                sx={{
                                                    fontSize: "14px",
                                                    "&:hover": { cursor: "pointer", color: "#EB8C00" },
                                                }}
                                            >
                                                <Grid item>
                                                    <Profile user={employee} />
                                                </Grid>
                                                <Grid item sx={{ fontSize: "14px" }}>
                                                    {employee.firstName} {employee.lastName}
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography fontWeight={"bold"} color={"secondary.main"}>
                                Reviewer
                            </Typography>
                        </Grid>
                        <Grid item xs={6} onClick={(e) => handleOpenReviewer(e)}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <Profile user={currentField[FIELD.REVIEWER]} />
                                </Grid>
                                <Grid
                                    item
                                    sx={{
                                        fontSize: "14px",
                                        "&:hover": {
                                            cursor: "pointer",
                                            color: isPrivileged(user.role) ? "#EB8C00" : "#000",
                                        },
                                    }}
                                >
                                    {currentField[FIELD.REVIEWER]?.firstName ?? "Unassigned"}
                                    {currentField[FIELD.REVIEWER]?.lastName ?? ""}
                                </Grid>
                            </Grid>
                        </Grid>
                        {(openReviewer || openReporter) && !loading && (
                            <Box
                                sx={{
                                    width: "100%",
                                    maxWidth: "360px",
                                    bgcolor: "background.paper",
                                }}
                            >
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        "aria-labelledby": "basic-button",
                                    }}
                                >
                                    <MenuItem>
                                        <TextField
                                            fullWidth
                                            label="Search"
                                            variant="outlined"
                                            value={searchEmployee}
                                            onChange={handleFilterEmployees}
                                            onKeyDown={(e) => e.stopPropagation()}
                                            size="small"
                                            sx={{ m: 1 }}
                                        />
                                    </MenuItem>
                                    {!loading &&
                                        filteredEmployees?.map((employee) => (
                                            <MenuItem
                                                key={employee.id}
                                                onClick={() => handleSelectEmployee(employee.id)}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                {`${employee.firstName} ${employee.lastName}`}
                                            </MenuItem>
                                        ))}
                                </Menu>
                            </Box>
                        )}
                    </Grid>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Typography color="#808080" fontSize="14px">{`Created ${dateToDaysAgo(
                    convertToPacificTime(incident.createdAt),
                )}`}</Typography>
                <Typography color="#808080" fontSize="14px">{`Updated ${dateToDaysAgo(
                    convertToPacificTime(incident.lastUpdatedAt),
                )}`}</Typography>
            </Box>
            <EmployeesInvolveEditModal
                open={openEmployeesInolveModal}
                onClose={() => setOpenEmployeesInvolveModal(false)}
                employees={filteredEmployees}
                involvedEmployees={currentField[FIELD.EMPLOYEES_INVOLVED]}
                setEmployees={setFilteredEmployees}
                handleFilterEmployees={handleFilterEmployees}
                handleOpenEmployeesListModal={handleOpenEmployeesListModal}
                search={searchEmployee}
                handleAddEmployee={handleAddEmployee}
                loading={loading}
            />
            <IncidentDateChangeModal
                open={openDateChangeModal}
                onClose={() => setOpenDateChangeModal(false)}
                loading={loading}
                updateDate={handleDateUpdate}
                date={currentField[FIELD.DATE]}
            />
        </Box>
    );
}
