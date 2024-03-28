import { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Stack,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    OutlinedInput,
    Chip,
    Checkbox,
    Grid,
} from "@mui/material";
import PreviewForm from "../form/PreviewForm";
import ReportChart from "./ReportChart";
import useDashboard from "../../hooks/useDashboard";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflow: "auto",
    maxHeight: "90%",
    display: "flex",
    flexDirection: "column",
};


function ReportModal({ open, onClose, newData, setNewData, boardId, onRefresh }) {
    const {updateBoard} = useDashboard();
    
    const handleSubmit = (field, start, end) => {
        const changedData = newData.map((c, i) => {
            if (i === selectedVal) {
              return {
                type: newData[i].type, 
                field: field,
                start: start,
                end: end
              };
            } else {
              return c;
            }
        });
        setNewData(changedData);
    };

    const [selectedVal, setSelectedVal] = useState(0);
    const handleChange = (event) => {
        setSelectedVal(event.target.value);
        setGraphType(newData[event.target.value].type);
    };

    const [graphType, setGraphType] = useState(newData[0].type)
    const handleGraphChange = (event) => {
        setGraphType(event.target.value);
        const changedData = newData.map((c, i) => {
            if (i === selectedVal) {
              return {
                type: event.target.value, 
                field: newData[i].field,
                start: newData[i].start,
                end: newData[i].end
              };
            } else {
              return c;
            }
        });
        setNewData(changedData);
    }

    const pushCloseButton = () => {
        onClose();
    }

    const pushSubmitButton = () => {
        updateBoard(boardId, newData);
        onRefresh();
        onClose();
    }

    
    return (
        <Modal
            open={open}
            onClose={() => {
                onClose();
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >

            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    Edit Dashboard
                </Typography>
                <Select
                    value={selectedVal}
                    label="Select Widget"
                    onChange={handleChange}
                >
                    <MenuItem value={0}>Top Left</MenuItem>
                    <MenuItem value={1}>Top Right</MenuItem>
                    <MenuItem value={2}>Bottom Left</MenuItem>
                    <MenuItem value={3}>Bottom Right</MenuItem>
                </Select>
                <Typography variant="h7" component="h2" sx={{ mb: 2 }}>
                    Widget details
                </Typography>
                <Typography variant="h8" sx={{ mb: 2 }}>
                    Select Graph Type
                </Typography>
                <Select
                    value={graphType}
                    label="Select Graph Type"
                    onChange={handleGraphChange}
                >
                    <MenuItem value={"Bar"}>Bar</MenuItem>
                    <MenuItem value={"Line"}>Line</MenuItem>
                    <MenuItem value={"Scatter"}>Scatter</MenuItem>
                    <MenuItem value={"Pie"}>Pie</MenuItem>
                </Select>
                <ReportChart type={newData[selectedVal].type} val={newData[selectedVal].field} locked={false} height={300} width={400} handleSubmit={handleSubmit}/>  
                <Button  
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, position: "fixed", bottom: "0px", right: "10px" }} 
                    onClick={pushSubmitButton}
                > 
                    Submit
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 3, position: "fixed", bottom: "50px", right: "10px" }}
                    onClick={pushCloseButton}
                >
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
}

export default ReportModal;
