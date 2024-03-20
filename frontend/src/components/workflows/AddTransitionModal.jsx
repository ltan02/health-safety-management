import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import EastIcon from "@mui/icons-material/East";

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
    minHeight: "35%",
    display: "flex",
    flexDirection: "column",
    pb: 5,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            fontSize: "12px",
        },
    },
};

function AddTransitionModal({
    open,
    handleClose,
    statuses,
    transitionName,
    handleTransitionNameChange,
    handleAddTransition,
    fromStatusNames,
    handleFromStatusChange,
    toStatusNames,
    handleToStatusChange,
}) {

    console.log(statuses);
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-status-modal-title"
            aria-describedby="add-status-modal-description"
        >
            <Box sx={style}>
                <Typography id="add-status-modal-title" variant="h6" component="h2">
                    Create transition
                </Typography>
                <Typography id="add-status-modal-description" variant="body" sx={{ fontSize: "14px" }}>
                    Transitions connect statuses. They represent actions people take to move issues through your
                    workflow. They also appear as drop zones when people move cards across your project&apos;s board.
                </Typography>
                <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
                    <FormControl sx={{ width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">From status</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            value={fromStatusNames?.data?.label ?? ""}
                            onChange={handleFromStatusChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    <Chip key={selected} label={selected} sx={{ fontSize: "12px" }} />
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            sx={{ fontSize: "12px" }}
                        >
                            {statuses.map((status) => (
                                <MenuItem key={status.id} value={status} sx={{ fontSize: "12px" }}>
                                    <ListItemText primary={status.data.label} sx={{ fontSize: "12px" }} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <EastIcon sx={{ marginX: 4 }} />
                    <FormControl sx={{ width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">To status</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            value={toStatusNames?.data?.label ?? ""}
                            onChange={handleToStatusChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    <Chip key={selected} label={selected} sx={{ fontSize: "12px" }} />
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            sx={{ fontSize: "12px" }}
                        >
                            {statuses.map((status) => (
                                <MenuItem key={status.id} value={status} sx={{ fontSize: "12px" }}>
                                    <ListItemText primary={status.data.label} sx={{ fontSize: "12px" }} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <TextField
                    id="outlined-number"
                    label="Name"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    placeholder="Give your transition a name"
                    sx={{ marginTop: 5 }}
                    value={transitionName}
                    onChange={handleTransitionNameChange}
                />
                <Typography id="add-status-modal-title" variant="body2" sx={{ fontSize: "12px" }}>
                    Tip: Name your transition as an action people take to move an issue, like &quot;start review&quot;
                    or &quot;add comment&quot;.
                </Typography>
                <div style={{ display: "flex", justifyContent: "end" }}>
                    <Button
                        onClick={handleAddTransition}
                        variant="outlined"
                        sx={{ mt: 3, mr: 2 }}
                        disabled={transitionName === "" || fromStatusNames === null || toStatusNames === null}
                    >
                        Add
                    </Button>
                    <Button onClick={handleClose} variant="outlined" sx={{ mt: 3 }}>
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default AddTransitionModal;
