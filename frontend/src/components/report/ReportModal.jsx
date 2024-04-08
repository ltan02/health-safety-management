import { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    Button,
    MenuItem,
    Select,
    Paper,
    FormControl,
    InputLabel,
    Grid, TextField,
} from "@mui/material";
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

function ReportModal({
  open,
  onClose,
  newData,
  setNewData,
  boardId,
  onRefresh,
  selectedVal,
    name,
}) {
  const { updateBoard } = useDashboard();

    const handleSubmit = (field, start, end) => {
        const changedData = newData.map((c, i) => {
            if (i === selectedVal) {
                return {
                    type: newData[i].type,
                    field: field,
                    start: start,
                    end: end,
                    name: newData[i].name,
                };
            } else {
                return c;
            }
        });
        setNewData(changedData);
    };

    // const [selectedVal, setSelectedVal] = useState(0);
    // const handleChange = (event) => {
    //     setSelectedVal(event.target.value);
    //     setName(newData[event.target.value].name);
    //     setGraphType(newData[event.target.value].type);
    // };

    const [graphType, setGraphType] = useState(newData[selectedVal].type);
    const handleGraphChange = (event) => {
        setGraphType(event.target.value);
        const changedData = newData.map((c, i) => {
            if (i === selectedVal) {
                return {
                    type: event.target.value,
                    field: newData[i].field,
                    start: newData[i].start,
                    end: newData[i].end,
                    name: newData[i].name,
                };
            } else {
                return c;
            }
        });
        setNewData(changedData);
    };

    const pushCloseButton = () => {
        onClose();
    };

    const pushSubmitButton = () => {
        updateBoard(boardId, newData);
        onRefresh();
        onClose();
    };



    const GraphNameHandler = (event) => {
        const changedData = newData.map((c, i) => {
            if (i === selectedVal) {
                return {
                    type: newData[i].type,
                    field: newData[i].field,
                    start: newData[i].start,
                    end: newData[i].end,
                    name: event.target.value,
                };
            } else {
                return c;
            }
        });
        setNewData(changedData);
    };

    console.log(name)
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          fontWeight={600}
          sx={{ mb: 3 }}
        >
          Customize Widget
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Widget details
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Graph Type</InputLabel>
              <Select
                value={newData[selectedVal].type}
                onChange={handleGraphChange}
                label="Select Graph Type"
                sx={{ mb: 3 }}
              >
                <MenuItem value="Bar">Bar</MenuItem>
                <MenuItem value="Line">Line</MenuItem>
                <MenuItem value="Scatter">Scatter</MenuItem>
                <MenuItem value="Pie">Pie</MenuItem>
              </Select>
            </FormControl>
              <InputLabel>Graph Name</InputLabel>
              <TextField
                  value={newData[selectedVal].name}
                  onChange={GraphNameHandler}
              />
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <ReportChart
                type={newData[selectedVal].type}
                data={newData[selectedVal]}
                locked={false}
                height={300}
                width={400}
                handleSubmit={handleSubmit}
              />
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={pushSubmitButton}
              sx={{ width: "100%" }}
            >
              Submit
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={pushCloseButton}
              sx={{ width: "100%" }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default ReportModal;
