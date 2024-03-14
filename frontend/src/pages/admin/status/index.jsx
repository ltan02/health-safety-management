import Dashboard from "./Dashboard";
import { useAuthContext } from "../../../context/AuthContext";
import { useBoard } from "../../../context/BoardContext";
import { isPrivileged } from "../../../utils/permissions";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

function AdminStatus() {
    const { user } = useAuthContext();
    const { adminColumns, employeeColumns, statuses, updateStatus, boardDetails } = useBoard();
    const [view, setView] = useState("ADMIN");

    const columns = isPrivileged(user.role) ? adminColumns : employeeColumns;

    const handleView = (event, newView) => {
        setView(newView);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100vw",
                minHeight: "calc(100vh - 65px)",
                maxHeight: "calc(100vh - 65px)",
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", width: "90%" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                        marginTop: "20px",
                    }}
                >
                    <div>
                        <h2>Columns and statuses</h2>
                    </div>
                    <div>
                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={handleView}
                            aria-label="column and statuses view"
                        >
                            <ToggleButton value="ADMIN" aria-label="admin view">
                                Admin view
                            </ToggleButton>
                            <ToggleButton value="EMPLOYEE" aria-label="employee view">
                                Employee view
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </div>
                <div>
                    <p style={{ fontSize: "15px" }}>
                        Use columns and statuses to define how incident reports progress on boards for admins and
                        employees. Store statuses in the left panel to hide their associated reports from the board.
                    </p>
                </div>
            </div>
            <div style={{ width: "90%", height: "100vh", padding: 0 }}>
                <Dashboard
                    columns={columns}
                    state={statuses}
                    updateBoardStatus={updateStatus}
                    boardId={boardDetails.id}
                />
            </div>
        </div>
    );
}

export default AdminStatus;
