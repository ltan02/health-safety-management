import { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Chip,
    alpha,
    CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useAxios from "../../hooks/useAxios";
import _ from "lodash";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    outline: "none",
    minHeight: "70%",
    display: "flex",
    flexDirection: "column",
    pb: 5,
};

const RULES = [
    {
        id: "restrict-who-can-move-an-issue",
        title: "Restrict who can move an issue",
        description: "Only allow certain people to move an issue using a particular action.",
    },
];

const ROLES = [
    {
        id: "ADMIN",
        name: "Admins",
    },
    {
        id: "SAFETY_WARDEN",
        name: "Safety Wardens",
    },
    {
        id: "EMPLOYEE",
        name: "Employees",
    },
];

function EditRuleModal({
    open,
    handleClose,
    states,
    selectedRule,
    handleEditRule,
    selectedTransition,
    transitions,
    handleDeleteRule,
}) {
    const [ruleIndex, setRuleIndex] = useState(0);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [ruleType, setRuleType] = useState("");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const { sendRequest } = useAxios();

    const resetFields = () => {
        setRuleIndex(0);
        setSelectedGroups([]);
        setSelectedUsers([]);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const response = await sendRequest({
                    url: "/users",
                    method: "GET",
                });

                setUsers(response);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedRule) {
            setRuleIndex(selectedRule.index);
            setSelectedGroups(selectedRule.roles);
            setSelectedUsers(selectedRule.userIds);
            setRuleType(selectedRule.type);
        }
    }, [selectedRule]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-status-modal-title"
            aria-describedby="add-status-modal-description"
        >
            {loadingUsers ? (
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
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 100000,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={style}>
                    <div style={{ display: "flex", marginBottom: 20 }}>
                        <Typography
                            id="add-status-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ marginRight: 15, whiteSpace: "nowrap" }}
                        >
                            Edit Rule
                        </Typography>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ position: "relative" }}>
                                <AccountCircleIcon sx={{ color: "#000" }} fontSize="large" />
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        backgroundColor: "#ffdddd",
                                        position: "absolute",
                                        bottom: 2,
                                        right: -4,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <LockIcon
                                        sx={{
                                            color: "#F00",
                                            fontSize: 18,
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    marginLeft: 10,
                                    justifyContent: "start",
                                    alignItems: "start",
                                    color: "#000",
                                }}
                            >
                                <h3>{RULES.find((rule) => rule.id === ruleType)?.title || ""}</h3>
                                <p>{RULES.find((rule) => rule.id === ruleType)?.description || ""}</p>
                            </div>
                        </div>
                        <h5 style={{ marginTop: 15 }}>For transition</h5>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #000",
                                padding: 10,
                                backgroundColor: alpha("#7D7D7D", 0.2),
                            }}
                        >
                            <p style={{ marginRight: 15 }}>
                                {transitions.find((transition) => transition.id === selectedTransition)?.label || ""}
                            </p>
                            <div style={{ marginRight: "10px", border: "1px solid #000", padding: 5 }}>
                                {states.find(
                                    (state) =>
                                        state.id ===
                                        transitions.find((transition) => transition.id === selectedTransition)?.source,
                                )?.data.label || ""}
                            </div>
                            <ArrowForwardIcon sx={{ marginRight: "10px" }} />
                            <div style={{ border: "1px solid #000", padding: 5 }}>
                                {states.find(
                                    (state) =>
                                        state.id ===
                                        transitions.find((transition) => transition.id === selectedTransition)?.target,
                                )?.data.label || ""}
                            </div>
                        </div>
                        <h5 style={{ marginTop: 15 }}>Allow these people</h5>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedUsers}
                            onChange={(event) =>
                                setSelectedUsers(
                                    typeof value === "string" ? event.target.value.split(",") : event.target.value,
                                )
                            }
                            displayEmpty
                            renderValue={(selected) => {
                                if (selectedUsers.length === 0)
                                    return <p style={{ color: "#7D7D7D" }}>Choose from available users</p>;

                                return (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={`${users.find((user) => user.id === value)?.firstName} ${
                                                    users.find((user) => user.id === value)?.lastName
                                                }`}
                                            />
                                        ))}
                                    </Box>
                                );
                            }}
                            MenuProps={MenuProps}
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    <Checkbox checked={selectedUsers.indexOf(user.id) > -1} />
                                    <ListItemText primary={`${user.firstName} ${user.lastName}`} />
                                </MenuItem>
                            ))}
                        </Select>
                        <h5 style={{ marginTop: 15 }}>Allow these roles</h5>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedGroups}
                            onChange={(event) =>
                                setSelectedGroups(
                                    typeof value === "string" ? event.target.value.split(",") : event.target.value,
                                )
                            }
                            displayEmpty
                            renderValue={(selected) => {
                                if (selectedGroups.length === 0)
                                    return <p style={{ color: "#7D7D7D" }}>Choose from available roles</p>;

                                return (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={ROLES.find((role) => role.id === value).name} />
                                        ))}
                                    </Box>
                                );
                            }}
                            MenuProps={MenuProps}
                        >
                            {ROLES.map((role, index) => (
                                <MenuItem key={index} value={role.id}>
                                    <Checkbox checked={selectedGroups.indexOf(role.id) > -1} />
                                    <ListItemText primary={role.name} />
                                </MenuItem>
                            ))}
                        </Select>
                        <Button
                            variant="text"
                            sx={{ position: "absolute", bottom: 30, left: 30 }}
                            onClick={() => {
                                handleDeleteRule(ruleIndex);
                                handleClose();
                                resetFields();
                            }}
                        >
                            Delete rule
                        </Button>
                        <Box sx={{ position: "absolute", bottom: 30, right: 30 }}>
                            <Button
                                variant="contained"
                                sx={{ marginRight: 2 }}
                                disabled={
                                    _.isEqual(selectedGroups, selectedRule.roles) &&
                                    _.isEqual(selectedUsers, selectedRule.userIds)
                                }
                                onClick={() => {
                                    handleEditRule(ruleIndex, selectedUsers, selectedGroups, ruleType);
                                    handleClose();
                                    resetFields();
                                }}
                            >
                                Update
                            </Button>
                            <Button variant="text" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Box>
                    </div>
                </Box>
            )}
        </Modal>
    );
}

export default EditRuleModal;
