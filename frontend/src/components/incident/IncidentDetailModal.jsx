import { useState, Fragment, useEffect } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { v4 as uuid } from "uuid";

import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import useAxios from "../../hooks/useAxios";
import { useAuthContext } from "../../context/AuthContext";
import { useBoard } from "../../context/BoardContext";
import { isPrivileged } from "../../utils/permissions";
import StatusModal from "./StatusModal";
import IncidentDetailField from "./IncidentDetailField";
import IncidentDetailBasicField from "./IncidentDetailBasicField";

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
  const { sendRequest, loading, sendAIRequest } = useAxios();
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
  const [openReporter, setOpenReporter] = useState(false);

  // if (!incident) return <></>;

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
      console.log(reviewerId);
      await sendRequest({
        url: `/incidents/${incidentId}/reporter/${reviewerId}`,
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

  const handleSwitchReporter = async (reporterId) => {
    try {
      console.log(reporterId);
      console.log(incidentId);
      console.log(user.id);
      await sendRequest({
        url: `/incidents/${incidentId}/reporter/${reporterId}`,
        method: "`POST`",
      });
      // setIncident((prevIncident) => {
      //   const newIncident = {
      //     ...prevIncident,
      //     reporterId: reporterId,
      //   };
      //   return newIncident;
      // });
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error(error);
    }
    setOpenReporter(false);
    // onClose();
  };

  const fetchEmployees = async (privileged) => {
    const response = await sendRequest({
      url: "/users",
      method: "GET",
    });
    if (!privileged) {
      setEmployees(response);
      return;
    } else {
      setEmployees(response.filter((employee) => isPrivileged(employee.role)));
    }
  };

  const handleOpenEmployeesListModal = async ({ e, privileged }) => {
    setAnchorEl(e.currentTarget);
    await fetchEmployees(privileged);
  };

  const handleUpdateEmployeesInvolved = async (employees) => {
    const involvedEmployees = employees.map((employee) => employee.id);
    await sendRequest({
      url: `/incidents/${incidentId}/employees_involved`,
      method: "PUT",
      body: {
        employeesInvolved: involvedEmployees,
      },
    });
    const newInvolvedEmployees = employees.filter((employee) =>
      involvedEmployees.includes(employee.id)
    );
    setIncident((prevIncident) => {
      const newIncident = {
        ...prevIncident,
        employeesInvolved: newInvolvedEmployees,
      };
      return newIncident;
    });
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleClose = () => {
    setOpenReviewer(false);
    setOpenReporter(false);
    setAnchorEl(null);
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
    if (editingCustomField === fieldName) {
      return;
    }
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
      if (customField.description) {
        const res = await sendAIRequest({
          url: "/categorize/",
          method: "POST",
          body: {
            incident: customField.description,
          },
        });
        await sendRequest({
          url: `/incidents/${incidentId}/category`,
          method: "PUT",
          body: {
            incidentCategory: res.response,
          },
        });
        setIncident((prevIncident) => {
          const newIncident = {
            ...prevIncident,
            incidentCategory: res.response,
          };
          return newIncident;
        });
      }

      setOldField(customField);
    } catch (error) {
      console.error(error);
    }
    setEditingCustomField(null);
  };

  const handleCancelChanges = () => {
    //not updated
    setEditingCustomField(null);
    setCustomField(oldField);
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
        <StatusModal
          isStatusModalOpen={isStatusModalOpen}
          toggleStatusModal={toggleStatusModal}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <IncidentDetailField
            incident={incident}
            user={user}
            commentData={commentData}
            incidentId={incidentId}
            customField={customField}
            handleAddComment={handleAddComment}
            handleEditCustomField={handleEditCustomField}
            editingCustomField={editingCustomField}
            setCustomField={setCustomField}
            handleSaveChanges={handleSaveChanges}
            handleCancelChanges={handleCancelChanges}
            comment={comment}
            setComment={setComment}
            loading={loading}
          />
          <IncidentDetailBasicField
            incident={incident}
            user={user}
            reviewer={reviewer}
            handleOpenEmployeesListModal={handleOpenEmployeesListModal}
            employees={employees}
            handleSwitchReviewer={handleSwitchReviewer}
            openReviewer={openReviewer}
            anchorEl={anchorEl}
            handleClose={handleClose}
            statuses={statuses}
            handleStateChange={handleStateChange}
            incidentState={incidentState}
            open={open}
            onClose={onClose}
            onRefresh={onRefresh}
            handleSwitchReporter={handleSwitchReporter}
            setOpenReporter={setOpenReporter}
            setOpenReviewer={setOpenReviewer}
            handleUpdateEmployeesInvolved={handleUpdateEmployeesInvolved}
            openReporter={openReporter}
            loading={loading}
          />
          <CircularProgress
            sx={{
              position: "fixed",
              top: "10%",
              left: "90%",
              display: loading ? "block" : "none",
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
}
