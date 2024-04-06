import { useState, useEffect } from "react";
import {
    SwipeableDrawer,
    Box,
    FormControl,
    TextField,
    Grid,
    Button,
    Typography,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Menu,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import useAxios from "../../hooks/useAxios";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const ROLES = {
    ["ADMIN"]: "Admins",
    ["SAFETY_WARDEN"]: "Safety Wardens",
    ["EMPLOYEE"]: "Employees",
};

const WorkflowSidebar = ({
    node,
    states,
    transitions,
    handleChangeFromStatus,
    handleChangeToStatus,
    handleChangeNode,
    setAddTransitionModalOpen,
    setFromStatusNames,
    deleteState,
    deleteTransition,
    setAddRuleModalOpen,
    setSelectedRule,
    deleteRule,
}) => {
    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(node ? node.data.label : "");
    const [newName, setNewName] = useState(node ? node.data.label : "");
    const [fromStatus, setFromStatus] = useState(node ? node.source : "");
    const [toStatus, setToStatus] = useState(node ? node.target : "");
    const [rules, setRules] = useState(node ? node?.data?.rules : []);
    const [users, setUsers] = useState([]);
    const { sendRequest } = useAxios();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [activeRule, setActiveRule] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await sendRequest({ url: "/users", method: "GET" });
            setUsers(response);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (node) {
            setName(node.data.label || "");
            setNewName(node.data.label || "");
            setFromStatus(node.source || "");
            setToStatus(node.target || "");
        }
    }, [node]);

    useEffect(() => {
        setRules(node?.data?.rules);
    }, [node?.data?.rules]);

    const handleSaveChanges = (event) => {
        event.stopPropagation();
        if (newName !== "") {
            setName(newName);
        }
        setNewName("");
        setEditingName(false);
    };

    const handleCancelChanges = (event) => {
        event.stopPropagation();
        setNewName("");
        setEditingName(false);
    };

    const handleMenuClick = (event, rule) => {
        setMenuAnchorEl(event.currentTarget);
        setActiveRule(rule);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setActiveRule(null);
    };

    const handleEditRule = () => {
        setSelectedRule(activeRule);
        handleMenuClose();
    };

    const handleDeleteRule = () => {
        deleteRule(activeRule?.index);
        handleMenuClose();
    };

    console.log(rules);

    return (
        <SwipeableDrawer
            ModalProps={{ keepMounted: true }}
            anchor="right"
            open={node !== null}
            onOpen={() => {}}
            onClose={() => {}}
            variant="persistent"
            sx={{
                "& .MuiDrawer-paper": {
                    width: 350,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    top: "98px",
                    height: "calc(100% - 98px)",
                    zIndex: 1,
                    padding: 2,
                    justifyContent: "space-between",
                },
            }}
        >
            <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 500 }}>{node.type ? "Transition" : "Status"}</h3>
                <p style={{ color: "#626F86", fontSize: "11px" }}>
                    {node.type
                        ? "Transitions connect statuses as actions that move reports through your flow."
                        : "Statuses capture the stages of your working process."}
                </p>

                <h4 style={{ fontSize: "13px", fontWeight: 600, marginTop: 20 }}>NAME</h4>
                <Box onClick={() => setEditingName(true)}>
                    {editingName ? (
                        <FormControl fullWidth>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                defaultValue={name}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <Grid container justifyContent={"right"} spacing={2} paddingTop={1}>
                                <Grid item>
                                    <Button variant="outlined" color="primary" onClick={handleSaveChanges}>
                                        Save
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="secondary" onClick={handleCancelChanges}>
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </FormControl>
                    ) : (
                        <Typography
                            sx={{
                                "&:hover": { background: "#f1f2f4" },
                                py: "10px",
                                px: "10px",
                                border: "1px solid #000",
                            }}
                            variant="body1"
                        >
                            {name}
                        </Typography>
                    )}
                </Box>
                {node.type && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h4 style={{ fontSize: "13px", fontWeight: 600, marginTop: 20 }}>PATH</h4>
                        <p style={{ fontSize: "11px", marginTop: 10 }}>From status</p>
                        <Select
                            value={fromStatus}
                            onChange={(event) => {
                                handleChangeFromStatus(event.target.value, node.id);
                                setFromStatus(event.target.value);
                            }}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                        >
                            {states.map((state) => (
                                <MenuItem key={state.id} value={state.id}>
                                    {state.data.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <p style={{ fontSize: "11px", marginTop: 20 }}>To status</p>
                        <Select
                            value={toStatus}
                            onChange={(event) => {
                                handleChangeToStatus(event.target.value, node.id);
                                setToStatus(event.target.value);
                            }}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                        >
                            {states.map((state) => (
                                <MenuItem key={state.id} value={state.id}>
                                    {state.data.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    justifyItems: "center",
                                    marginTop: 20,
                                }}
                            >
                                <h4 style={{ fontSize: "13px", fontWeight: 600 }}>RULES</h4>
                                <Tooltip title="Add rule" placement="bottom">
                                    <IconButton onClick={() => setAddRuleModalOpen(true)}>
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            {node?.data?.rules?.length === 0 ? (
                                <p style={{ fontSize: "11px" }}>Rules help you save time when moving an issue.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <h3 style={{ fontSize: "16px" }}>Restrict transition</h3>
                                    <p style={{ fontSize: "11px" }}>Hide this transition when these aren&apos;t met</p>
                                    {rules.map((rule, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                border: "1px solid #7D7D7D",
                                                borderRadius: "4px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: 8,
                                                marginTop: 10,
                                            }}
                                        >
                                            {rule.type === "restrict-who-can-move-an-issue" && (
                                                <>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <div style={{ position: "relative" }}>
                                                            <AccountCircleIcon
                                                                sx={{ color: "#000" }}
                                                                fontSize="medium"
                                                            />
                                                            <div
                                                                style={{
                                                                    width: "16px",
                                                                    height: "16px",
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
                                                                        fontSize: 14,
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
                                                            <h3 style={{ fontSize: "13px" }}>
                                                                Restrict who can move an issue
                                                            </h3>
                                                            <p style={{ fontSize: "12px" }}>{`Only${
                                                                rule.userIds.length === 0
                                                                    ? rule.roles.length === 0
                                                                        ? ""
                                                                        : rule.roles.length === 1
                                                                        ? ROLES[rule.roles[0]]
                                                                        : ` ${rule.roles.length} roles`
                                                                    : rule.userIds.length === 1
                                                                    ? rule.roles.length === 0
                                                                        ? ` ${
                                                                              users.find(
                                                                                  (user) => user.id === rule.userIds[0],
                                                                              ).firstName
                                                                          } ${
                                                                              users.find(
                                                                                  (user) => user.id === rule.userIds[0],
                                                                              ).lastName
                                                                          }`
                                                                        : rule.roles.length === 1
                                                                        ? ` ${
                                                                              users.find(
                                                                                  (user) => user.id === rule.userIds[0],
                                                                              ).firstName
                                                                          } ${
                                                                              users.find(
                                                                                  (user) => user.id === rule.userIds[0],
                                                                              ).lastName
                                                                          } and ${ROLES[rule.roles[0]]}`
                                                                        : ` ${
                                                                              users.find(
                                                                                  (user) => user.id === rule.userIds[0],
                                                                              ).firstName
                                                                          } ${
                                                                              users.find(
                                                                                  (user) => user.id === rule.userIds[0],
                                                                              ).lastName
                                                                          } and ${rule.roles.length} roles`
                                                                    : rule.roles.length === 0
                                                                    ? ` ${rule.userIds.length} people`
                                                                    : rule.roles.length === 1
                                                                    ? ` ${rule.userIds.length} people and ${
                                                                          ROLES[rule.roles[0]]
                                                                      }`
                                                                    : ` ${rule.userIds.length} people and ${rule.roles.length} roles`
                                                            } can see this transition`}</p>
                                                        </div>
                                                    </div>
                                                    <IconButton onClick={(event) => handleMenuClick(event, rule)}>
                                                        <MoreHorizIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={menuAnchorEl}
                                                        open={Boolean(menuAnchorEl)}
                                                        onClose={handleMenuClose}
                                                        MenuListProps={{
                                                            "aria-labelledby": "basic-button",
                                                        }}
                                                    >
                                                        <MenuItem onClick={handleEditRule}>Edit rule</MenuItem>
                                                        <MenuItem onClick={handleDeleteRule}>Delete rule</MenuItem>
                                                    </Menu>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {!node.type && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                justifyItems: "center",
                                marginTop: 20,
                            }}
                        >
                            <h4 style={{ fontSize: "13px", fontWeight: 600 }}>TRANSITIONS</h4>
                            <Tooltip title="Create transition" placement="left">
                                <IconButton
                                    onClick={() => {
                                        setFromStatusNames(node);
                                        setAddTransitionModalOpen(true);
                                    }}
                                >
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <p style={{ fontSize: "11px" }}>
                            Transitions connect statuses. They represent actions people take to move issues through your
                            workflow.
                        </p>
                        {transitions
                            .filter((transition) => transition.source === node.id)
                            .map((transition) => (
                                <Button
                                    onClick={() => handleChangeNode(transition.id)}
                                    key={transition.id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "start",
                                        marginTop: "15px",
                                        borderRadius: "4px",
                                        boxShadow: "1px 1px #091e4240",
                                        borderBottom: "1.5px solid #091e4240",
                                        borderTop: "1px solid #091e4240",
                                        padding: 2,
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column" }}>
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
                                            {transition.data.label}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                color: "#000",
                                                fontSize: "12px",
                                                alignItems: "center",
                                                marginTop: "10px",
                                            }}
                                        >
                                            <div style={{ marginRight: "10px", border: "1px solid #000", padding: 5 }}>
                                                {states.find((state) => state.id === transition.source).data.label}
                                            </div>
                                            <ArrowForwardIcon sx={{ marginRight: "10px" }} />
                                            <div style={{ border: "1px solid #000", padding: 5 }}>
                                                {states.find((state) => state.id === transition.target).data.label}
                                            </div>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                    </div>
                )}
            </div>
            <div style={{ paddingBottom: 10, paddingLeft: 5 }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (node.type) {
                            deleteTransition(node.id);
                        } else {
                            deleteState(node.id);
                        }
                    }}
                >{`Delete ${node.type ? "Transition" : "Status"}`}</Button>
            </div>
        </SwipeableDrawer>
    );
};

export default WorkflowSidebar;
