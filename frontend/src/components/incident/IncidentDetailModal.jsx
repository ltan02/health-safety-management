import { useState, Fragment, useEffect } from "react";
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
  Menu,
  Button,
  FormControl,
  TextField,
} from "@mui/material";
import { v4 as uuid } from "uuid";

import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import useAxios from "../../hooks/useAxios";
import { useAuthContext } from "../../context/AuthContext";
import { formatCamelCaseToNormalText } from "../../utils/textFormat";
import Profile from "../users/Profile";
import { convertToPacificTime } from "../../utils/date";
import { dateToDaysAgo } from "../../utils/date";
import { useBoard } from "../../context/BoardContext";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { isPrivileged } from "../../utils/permissions";
import CommentSection from "./CommentSection";
import { set } from "lodash";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  maxHeight: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  border: "2px solid",
  borderColor: "#7D7D7D",
};

export default function IncidentDetailModal({
  incidentId,
  selectedIncident,
  open,
  onClose,
  onRefresh,
  commentData,
  setCommentData,
}) {
  const { sendRequest, loading } = useAxios();
  const { user } = useAuthContext();
  const { statuses } = useBoard();

  const [incident, setIncident] = useState(selectedIncident);
  const [incidentState, setIncidentState] = useState(selectedIncident.statusId);
  const [openReviewer, setOpenReviewer] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [editingCustomField, setEditingCustomField] = useState(null);
  const [customField, setCustomField] = useState({});
  const [oldField, setOldField] = useState({});
  const [reviewer, setReviewer] = useState(null);

  if (!incident) return <></>;

  const handleStateChange = async (event) => {
    const newStateId = event.target.value;

    await sendRequest({
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
    setStatusModalOpen(true);

    if (onRefresh) {
      onRefresh();
    }
  };

  const handleSwitchReviewer = async (reviewerId) => {
    try {
      await sendRequest({
        url: `/incidents/${incidentId}/reviewer/${reviewerId}`,
        method: "POST",
      });

      setIncident((prevIncident) => {
        const newIncident = {
          ...prevIncident,
          reviewerId: reviewerId,
        };
        return newIncident;
      });

      setReviewer(employees.find((employee) => employee.id === reviewerId));

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error(error);
    }
    setOpenReviewer(false);
    // onClose();
  };

  const fetchEmployees = async () => {
    const response = await sendRequest({
      url: "/users",
      method: "GET",
    });
    setEmployees(response.filter((employee) => isPrivileged(employee.role)));
  };

  const handleOpenModal = async (e) => {
    setAnchorEl(e.currentTarget);
    await fetchEmployees();
    setOpenReviewer(true);
  };

  const handleClose = () => {
    setOpenReviewer(false);
  };

  const toggleStatusModal = () => {
    setStatusModalOpen(!isStatusModalOpen);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment) {
      return;
    }
    setComment("");
    await sendRequest({
      url: `/incidents/${incidentId}/comments`,
      method: "POST",
      body: {
        content: comment,
      },
    });
    const tempComment = {
      id: "temp-" + uuid(),
      comment: {
        content: comment,
        timestamp: new Date().toISOString(),
        userId: user.id,
      },
      user: user,
    };
    const newCommentData = { ...commentData };
    if (!newCommentData[incidentId]) {
      newCommentData[incidentId] = [];
    }
    newCommentData[incidentId].push(tempComment);
    setCommentData(newCommentData);
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleEditCustomField = (fieldName) => {
    setEditingCustomField(fieldName);
  };

  const handleSaveChanges = async () => {
    const updatedField = [];
    try {
      Object.keys(customField).map((fieldName) => {
        if (customField[fieldName] !== oldField[fieldName]) {
          updatedField.push({ fieldName, value: customField[fieldName] });
        }
      });
      await sendRequest({
        url: `/incidents/${incidentId}/fields`,
        method: "PUT",
        body: {
          customFields: updatedField,
        },
      });
      setOldField(customField);
    } catch (error) {
      console.error(error);
    }
    setEditingCustomField(null);
  };

  const handleCancelChanges = () => {
    setCustomField(oldField);
    setEditingCustomField(null);
  };

  const isEdited = () => {
    return Object.keys(customField).some((fieldName) => {
      return customField[fieldName] !== oldField[fieldName];
    });
  };

  useEffect(() => {
    Object.keys(incident?.customFields ?? {}).map((fieldName) => {
      setCustomField((prev) => ({
        ...prev,
        [fieldName]: incident.customFields[fieldName],
      }));
      setOldField((prev) => ({
        ...prev,
        [fieldName]: incident.customFields[fieldName],
      }));
    });
    setReviewer(incident?.reviewer);
  }, []);

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
        <Modal
          open={isStatusModalOpen}
          onClose={toggleStatusModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 150,
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                bgcolor: "#FFB600",
              }}
            >
              <IconButton onClick={toggleStatusModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: 2,
                alignItems: "center",
              }}
            >
              <Typography variant="body1" align="center">
                Status was successfully changed!
              </Typography>
              <Box
                sx={{ display: "inline-block", mt: 2, alignItems: "center" }}
              >
                <Button
                  variant="contained"
                  onClick={toggleStatusModal}
                  sx={{ borderRadius: 10 }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
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
              width: "55%",
              marginRight: 2,
            }}
            style={{ overflowY: "auto", height: "70vh" }}
          >
            <Typography
              id="issue-detail-modal-title"
              variant="h5"
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              {`${incident.incidentCategory} on ${incident.incidentDate}`}
            </Typography>

            {Object.keys(customField).map((fieldName) => {
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
                  <Box onClick={() => handleEditCustomField(fieldName)}>
                    {editingCustomField === fieldName ? (
                      <FormControl fullWidth margin="normal">
                        <TextField
                          multiline
                          variant="outlined"
                          required
                          fullWidth
                          defaultValue={customField[fieldName]}
                          onChange={(e) =>
                            setCustomField((prev) => ({
                              ...prev,
                              [fieldName]: e.target.value,
                            }))
                          }
                        />
                        <Grid
                          container
                          justifyContent={"right"}
                          spacing={2}
                          paddingTop={1}
                        >
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleSaveChanges}
                              disabled={loading}
                            >
                              Save
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={handleCancelChanges}
                            >
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
                        }}
                        variant="body1"
                      >
                        {customField[fieldName]}
                      </Typography>
                    )}
                  </Box>
                </Fragment>
              );
            })}

            <Box>
              <Typography
                sx={{
                  mt: 2,
                  mb: 0.5,
                  fontWeight: 600,
                  color: "secondary.main",
                }}
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
                  paddingLeft: "0px",
                }}
              >
                <form
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 2,
                    width: "100%",
                  }}
                  onSubmit={handleAddComment}
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
                    value={comment}
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
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    variant="outlined"
                    sx={{ borderRadius: 10 }}
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                </form>
              </Box>
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <CommentSection
                  commentData={commentData}
                  incidentId={incidentId}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "45%",
              alignItems: "flex-start",
              rowGap: 2,
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ position: "fixed", top: "10%", right: "10%" }}>
              {loading ? <CircularProgress size={24} /> : <></>}
            </Box>
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
                height: "90%",
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
                      <Typography sx={{ fontSize: "14px" }}>
                        {incident.incidentDate}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography fontWeight={"bold"} color={"secondary.main"}>
                      Category
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {incident && (
                      <Typography sx={{ fontSize: "14px" }}>
                        {incident.incidentCategory}
                      </Typography>
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
                        <Grid item sx={{ fontSize: "14px" }}>
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
                              <Grid item sx={{ fontSize: "14px" }}>
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
                    <Grid container spacing={1} alignItems="center">
                      <Grid item>
                        <Profile user={reviewer} />
                      </Grid>
                      <Grid item sx={{ fontSize: "14px" }}>
                        {reviewer?.firstName ?? "Unassigned"}
                        {reviewer?.lastName ?? ""}
                        {isPrivileged(user.role) && (
                          <IconButton onClick={handleOpenModal}>
                            <ChangeCircleIcon />
                          </IconButton>
                        )}
                        {openReviewer && (
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}
                          >
                            {employees?.map((employee) => {
                              return (
                                <MenuItem
                                  key={employee.id}
                                  onClick={() =>
                                    handleSwitchReviewer(employee.id)
                                  }
                                >
                                  {employee.firstName} {employee.lastName}
                                </MenuItem>
                              );
                            })}
                          </Menu>
                        )}
                      </Grid>
                    </Grid>
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
