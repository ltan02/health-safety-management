import { useState } from "react";
import { Modal, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const RoleSwitchModal = ({ children }) => {
    const [show, setShow] = useState(false);
    const [role, setRole] = useState("admin");

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);
    const handleRoleSwitch = () => {
        console.log(role);
        handleClose();
    };

    return (
        <div>
            <Button
                variant="contained"
                sx={{
                    width: "100%",
                }}
                onClick={handleOpen}
            >
                <Typography fontSize={"1.2rem"}>{children}</Typography>
            </Button>
            <Modal
                open={show}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Switch Role
                    </Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Role</InputLabel>
                        <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="user">User</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button variant="contained" color="secondary" onClick={handleClose} sx={{ mr: 1 }}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleRoleSwitch}>
                            Switch
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default RoleSwitchModal;
