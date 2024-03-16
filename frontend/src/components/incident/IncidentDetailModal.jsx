import { useState, useEffect, Fragment } from "react";
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Avatar,
  TextareaAutosize,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useAxios from "../../hooks/useAxios";
import { useAuthContext } from "../../context/AuthContext";
import { formatCamelCaseToNormalText } from "../../utils/textFormat";
import Profile from "../users/Profile";
import { convertToPacificTime } from "../../utils/date";
import { dateToDaysAgo } from "../../utils/date";
import { useBoard } from "../../context/BoardContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  border: "2rem solid",
  borderColor: "#7D7D7D",
};

export default function IncidentDetailModal({
  incidentId,
  selectedIncident,
  open,
  onClose,
  onRefresh,
}) {
  const { sendRequest } = useAxios();
  const { user } = useAuthContext();
  const { statuses } = useBoard();

  const [incident, setIncident] = useState(selectedIncident);
  const [incidentState, setIncidentState] = useState(selectedIncident.statusId);

  if (!incident) return <></>;

  const handleStateChange = async (event) => {
    const newStateId = event.target.value;

    sendRequest({
      url: `/incidents/${incidentId}`,
      method: "POST",
      body: {
        statusId: newStateId,
      },
    });

    setIncident((prevIncident) => {
      const newIncident = {
        ...prevIncident,
        statusId: newStateId,
      };
      return newIncident;
    });
    setIncidentState(newStateId);

    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="issue-detail-modal"
      aria-describedby="issue-details"
    >
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
            }}
          >
            <Typography
              id="issue-detail-modal-title"
              variant="h5"
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              {`${incident.incidentCategory} on ${incident.incidentDate}`}
            </Typography>
            {Object.keys(incident?.customFields ?? {}).map((fieldName) => {
              return (
                <Fragment key={fieldName}>
                  <Typography
                    sx={{
                      mt: 2,
                      mb: 0.5,
                      fontWeight: 600,
                      color: "secondary.main",
                    }}
                  >
                    {formatCamelCaseToNormalText(fieldName)}
                  </Typography>
                  <Typography variant="body2">
                    {incident.customFields[fieldName]}
                  </Typography>
                </Fragment>
              );
            })}
            <Typography
              sx={{ mt: 2, mb: 0.5, fontWeight: 600, color: "secondary.main" }}
            >
              Comments
            </Typography>
            <Box
              sx={{
                display: "flex",
                mt: 2,
                gap: 2,
                width: "100%",
                alignItems: "center",
                paddingLeft: "0.5rem",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#DB536A",
                  width: "30px",
                  height: "30px",
                  fontSize: "14px",
                }}
              >
                {`${user.firstName[0]}${user.lastName[0]}`}
              </Avatar>
              <TextareaAutosize
                minRows={1}
                maxRows={4}
                placeholder="Add a comment..."
                style={{
                  width: "100%",
                  padding: "10px",
                  textAlign: "start",
                  border: "none",
                  resize: "none",
                  outline: "none",
                  borderRadius: "7px",
                  lineHeight: "50px",
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              alignItems: "flex-start",
              rowGap: 2,
            }}
          >
            <Select
              value={incidentState ?? ""}
              onChange={handleStateChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                backgroundColor: "#f1f2f4",
                border: "none",
                height: "3rem",
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: "#dddfe5",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              {statuses.map(({ id, name }) => {
                return (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
            <Box
              sx={{
                border: 1,
                borderRadius: "5px",
                borderColor: "#464646",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: "#464646",
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Helvetica",
                  color: "secondary.main",
                }}
              >
                Details
              </Box>
              <Box sx={{ mt: 2, px: 2, pb: 2 }}>
                <Grid container spacing={2} sx={{ rowGap: 1 }}>
                  <Grid item xs={6}>
                    <Typography fontWeight={"bold"} color={"secondary.main"}>
                      Date of Incident
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {incident && (
                      <Typography>{incident.incidentDate}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontWeight={"bold"} color={"secondary.main"}>
                      Category
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {incident && (
                      <Typography>{incident.incidentCategory}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontWeight={"bold"} color={"secondary.main"}>
                      Reporter
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {incident && (
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <Profile user={incident.reporter} />
                        </Grid>
                        <Grid item>
                          {incident.reporter.firstName}{" "}
                          {incident.reporter.lastName}
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontWeight={"bold"} color={"secondary.main"}>
                      Employees Involved
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ rowGap: 1 }}>
                    {incident &&
                      incident.employeesInvolved
                        .filter(
                          (employee) => employee.id !== incident.reporter.id
                        )
                        .map((employee) => {
                          return (
                            <Grid
                              container
                              spacing={1}
                              alignItems="center"
                              key={employee.id}
                              paddingBottom={1}
                            >
                              <Grid item>
                                <Profile user={employee} />
                              </Grid>
                              <Grid item>
                                {employee.firstName} {employee.lastName}
                              </Grid>
                            </Grid>
                          );
                        })}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontWeight={"bold"} color={"secondary.main"}>
                      Reviewer
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {incident.reviewer && (
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <Profile user={incident.reviewer} />
                        </Grid>
                        <Grid item>
                          {incident.reviewer.firstName}{" "}
                          {incident.reviewer.lastName}
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                color="#808080"
                fontSize="14px"
              >{`Created ${dateToDaysAgo(
                convertToPacificTime(incident.createdAt)
              )}`}</Typography>
              <Typography
                color="#808080"
                fontSize="14px"
              >{`Updated ${dateToDaysAgo(
                convertToPacificTime(incident.lastUpdatedAt)
              )}`}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
