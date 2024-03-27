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

const largeTextFieldStyle = {
    "& .MuiOutlinedInput-root": {
        height: "5em",
    },
};

function ReportModal({ open, onClose, data, setDashData }) {
    
    const handleSubmit = (field, start, end) => {
        const newData = data.map((c, i) => {
            if (i === selectedVal) {
              return {
                type: data[i].type, 
                field: field,
                start: start,
                end: end
              };
            } else {
              return c;
            }
        });
        console.log(newData)
        setDashData(newData);
    };

    const [selectedVal, setSelectedVal] = useState(0);
    const handleChange = (event) => {
        setSelectedVal(event.target.value);
    };

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
                <ReportChart type={data[selectedVal].type} val={data[selectedVal].field} locked={false} height={300} width={400} handleSubmit={handleSubmit}/>
            </Box>
        </Modal>
    );
}

export default ReportModal;
