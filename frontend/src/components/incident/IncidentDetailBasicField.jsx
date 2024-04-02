import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
} from "@mui/material";
import { ChangeCircle as ChangeCircleIcon } from "@mui/icons-material";
import { convertToPacificTime } from "../../utils/date";
import { dateToDaysAgo } from "../../utils/date";
import { isPrivileged } from "../../utils/permissions";
import Profile from "../users/Profile";
export default function IncidentDetailBasicField({
  incident,
  reviewer,
  employees,
  user,
  handleStateChange,
  incidentState,
  handleOpenModal,
  openReviewer,
  anchorEl,
  open,
  handleClose,
  handleSwitchReviewer,
  loading,
  statuses,
}) {
  return (
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
                    {incident.reporter.firstName} {incident.reporter.lastName}
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
                  .filter((employee) => employee.id !== incident.reporter.id)
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
                            onClick={() => handleSwitchReviewer(employee.id)}
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
        <Typography color="#808080" fontSize="14px">{`Created ${dateToDaysAgo(
          convertToPacificTime(incident.createdAt)
        )}`}</Typography>
        <Typography color="#808080" fontSize="14px">{`Updated ${dateToDaysAgo(
          convertToPacificTime(incident.lastUpdatedAt)
        )}`}</Typography>
      </Box>
    </Box>
  );
}
