import { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Chip,
    CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useAxios from "../../hooks/useAxios";

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

function AddRuleModal({ open, handleClose, states, transitions, selectedNode, handleAddUserRestrictionRule }) {
    const [searchedRule, setSearchedRule] = useState("");
    const [chosenRule, setChosenRule] = useState(null);
    const [selectedRule, setSelectedRule] = useState(null);
    const [selectedTransition, setSelectedTransition] = useState(selectedNode?.id);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const { sendRequest } = useAxios();

    const resetFields = () => {
        setChosenRule(null);
        setSelectedRule(null);
        setSelectedTransition(null);
        setSelectedGroups([]);
        setSelectedUsers([]);
    };

    const filteredRules =
        searchedRule === ""
            ? RULES
            : RULES.filter((rule) => rule.title.toLowerCase().includes(searchedRule.toLowerCase()));

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

        if (chosenRule === "restrict-who-can-move-an-issue") {
            fetchUsers();
        }
    }, [chosenRule]);

    useEffect(() => {
        if (selectedNode) {
            setSelectedTransition(selectedNode.id);
        }
    }, [selectedNode]);

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
                            Add rule
                        </Typography>
                    </div>
                    {chosenRule === null && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                            }}
                        >
                            <Box sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
                                <Typography sx={{ fontSize: 14, marginBottom: 2 }}>
                                    Rules streamline your team&apos;s process by limiting when your team can use a
                                    transition
                                </Typography>
                                <TextField
                                    label="Search..."
                                    variant="outlined"
                                    sx={{ width: "100%" }}
                                    size="medium"
                                    onChange={(event) => setSearchedRule(event.target.value)}
                                />
                                {filteredRules.length > 0 ? (
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={selectedRule}
                                        exclusive
                                        onChange={(e, value) => setSelectedRule(value)}
                                        sx={{ width: "100%", marginTop: 2, overflowY: "auto" }}
                                    >
                                        {filteredRules.map((rule) => (
                                            <ToggleButton
                                                value="restrict-who-can-move-an-issue"
                                                key={rule.id}
                                                sx={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent: "start",
                                                    alignItems: "center",
                                                    border: 0,
                                                }}
                                            >
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
                                                    <h3>{rule.title}</h3>
                                                    <p>{rule.description}</p>
                                                </div>
                                            </ToggleButton>
                                        ))}
                                    </ToggleButtonGroup>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "100%",
                                            justifyContent: "center",
                                            marginTop: 20,
                                        }}
                                    >{`We couldn't find any results for "${searchedRule}"`}</div>
                                )}
                            </Box>
                            <Box sx={{ position: "absolute", bottom: 30, right: 30 }}>
                                <Button
                                    variant="contained"
                                    sx={{ marginRight: 2 }}
                                    disabled={!selectedRule}
                                    onClick={() => setChosenRule(selectedRule)}
                                >
                                    Select
                                </Button>
                                <Button variant="text" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {chosenRule === "restrict-who-can-move-an-issue" && (
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
                                    <h3>{RULES.find((rule) => rule.id === chosenRule).title}</h3>
                                    <p>{RULES.find((rule) => rule.id === chosenRule).description}</p>
                                </div>
                            </div>
                            <h5 style={{ marginTop: 15 }}>For transition</h5>
                            <Select
                                value={selectedTransition || ""}
                                onChange={(event) => setSelectedTransition(event.target.value)}
                            >
                                {transitions.map((transition) => (
                                    <MenuItem key={transition.id} value={transition.id}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <p style={{ marginRight: 15 }}>{transition?.label}</p>
                                            <div style={{ marginRight: "10px", border: "1px solid #000", padding: 5 }}>
                                                {states.find((state) => state.id === transition.source).data.label}
                                            </div>
                                            <ArrowForwardIcon sx={{ marginRight: "10px" }} />
                                            <div style={{ border: "1px solid #000", padding: 5 }}>
                                                {states.find((state) => state.id === transition.target).data.label}
                                            </div>
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
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
                                                    label={`${users.find((user) => user.id === value).firstName} ${
                                                        users.find((user) => user.id === value).lastName
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
                                                <Chip
                                                    key={value}
                                                    label={ROLES.find((role) => role.id === value).name}
                                                />
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
                            <Box sx={{ position: "absolute", bottom: 30, right: 30 }}>
                                <Button
                                    variant="contained"
                                    sx={{ marginRight: 2 }}
                                    disabled={
                                        !selectedTransition ||
                                        selectedTransition === "" ||
                                        (selectedGroups.length === 0 && selectedUsers.length === 0)
                                    }
                                    onClick={() => {
                                        handleAddUserRestrictionRule(selectedTransition, selectedUsers, selectedGroups);
                                        handleClose();
                                        resetFields();
                                    }}
                                >
                                    Add
                                </Button>
                                <Button variant="text" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Box>
                        </div>
                    )}
                </Box>
            )}
        </Modal>
    );
}

export default AddRuleModal;
