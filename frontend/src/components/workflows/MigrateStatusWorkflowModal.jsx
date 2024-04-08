import { Modal, Box, Typography, Button, Divider, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    outline: "none",
};

function MigrateStatusWorkflowModal({
    open,
    handleClose,
    statusesToMigrate,
    states,
    setMigrationMap,
    migrationMap,
    saveChanges,
}) {
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [activeStatusId, setActiveStatusId] = useState(null);

    const handleMenuClick = (event, statusId) => {
        setMenuAnchorEl(event.currentTarget);
        setActiveStatusId(statusId);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setActiveStatusId(null);
    };

    const handleStatusChange = (stateId, newStatusId) => {
        setMigrationMap((prev) => ({
            ...prev,
            [stateId]: newStatusId,
        }));
        handleMenuClose();
    };

    useEffect(() => {
        const localMigrationMap = {};
        const initialMigrationStatus = states.find(
            (state) => !statusesToMigrate.includes(state.id) && state.data.label !== "START",
        );
        statusesToMigrate.forEach((status) => {
            localMigrationMap[status.id] = initialMigrationStatus?.data?.statusId;
        });
        setMigrationMap(localMigrationMap);
    }, [states]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="save-changes-modal-title"
            aria-describedby="save-changes-modal-description"
        >
            <Box sx={style}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                        id="save-changes-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontSize: "16px", fontWeight: 600 }}
                    >
                        Move issues to new statuses
                    </Typography>
                </div>

                <Typography id="save-changes-modal-description" sx={{ fontWeight: 400, fontSize: "14px" }}>
                    You may have issues in statuses that aren&apos;t in your updated workflow. To prevent errors,
                    let&apos;s move those issues to new statuses. This won&apos;t trigger any rules.
                </Typography>

                <h5 style={{ fontSize: "14px", fontWeight: 600, marginLeft: "15px", marginTop: "20px" }}>
                    By default, move issues to these statuses
                </h5>
                <div
                    style={{
                        padding: "16px",
                        backgroundColor: "#F7F8F9",
                        border: "1px solid #091E42",
                        borderRadius: "3px",
                        marginTop: "5px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ display: "flex", color: "#626F86", fontSize: "12px", fontWeight: 600 }}>
                        <div style={{ width: "50%" }}>Current status</div>
                        <div>New status</div>
                    </div>
                    <Divider sx={{ marginTop: "5px", marginBottom: "5px", borderBottomWidth: "2px" }} />
                    {statusesToMigrate.map((status) => (
                        <div key={status.id} style={{ display: "flex", marginTop: "10px" }}>
                            <div
                                style={{
                                    width: "48%",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    display: "flex",
                                }}
                            >
                                <div
                                    style={{
                                        border: "1px solid #5d5d5d",
                                        borderRadius: "10px",
                                        padding: "2px 5px",
                                        textAlign: "center",
                                        fontSize: "11px",
                                        color: "#000",
                                        width: "fit-content",
                                    }}
                                >
                                    <s>{status.data.label}</s>
                                </div>
                                <ArrowForwardIcon fontSize="small" />
                            </div>
                            <div style={{ marginLeft: "10px" }}>
                                <Button
                                    sx={{
                                        textTransform: "none",
                                        padding: "2px 5px",
                                        fontSize: "11px",
                                        color: "#000",
                                        border: "1px solid #5d5d5d",
                                        borderRadius: "10px",
                                        minWidth: "fit-content",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    onClick={(event) => handleMenuClick(event, status.id)}
                                >
                                    {states.find((state) => migrationMap[status.id] === state.data.statusId)?.data?.label || ""}
                                    <ArrowDropDownIcon sx={{ fontSize: "20px" }} />
                                </Button>
                                <Menu
                                    anchorEl={menuAnchorEl}
                                    open={Boolean(menuAnchorEl) && activeStatusId === status.id}
                                    onClose={handleMenuClose}
                                >
                                    {states
                                        .filter((state) => state.data.label !== "START")
                                        .map((state) => (
                                            <MenuItem
                                                key={state.id}
                                                onClick={() => handleStatusChange(status.id, state.data.statusId)}
                                            >
                                                {state.data.label}
                                            </MenuItem>
                                        ))}
                                </Menu>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button
                        onClick={() => {
                            saveChanges(migrationMap);
                            handleClose();
                        }}
                        variant="contained"
                        sx={{ mt: 3, mr: 2 }}
                    >
                        Update workflow
                    </Button>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 3 }}>
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default MigrateStatusWorkflowModal;
