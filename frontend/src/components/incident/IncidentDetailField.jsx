import React, { Fragment, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  TextField,
  Button,
  Grid,
  Avatar,
  TextareaAutosize,
} from "@mui/material";
import { formatCamelCaseToNormalText } from "../../utils/textFormat";
import CommentSection from "./CommentSection";
export default function IncidentDetailField({
  incident,
  user,
  commentData,
  incidentId,
  customField,
  handleAddComment,
  handleEditCustomField,
  editingCustomField,
  setCustomField,
  handleSaveChanges,
  handleCancelChanges,
  comment,
  setComment,
  loading,
}) {
  return (
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
                <FormControl fullWidth>
                  <TextField
                    multiline
                    rows={customField[fieldName].length / 50}
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
                    autoFocus
                  />
                  <Grid
                    container
                    justifyContent={"right"}
                    spacing={2}
                    paddingTop={1}
                  >
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSaveChanges}
                        disabled={loading}
                      >
                        Save
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancelChanges}
                        disabled={loading}
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
          <CommentSection commentData={commentData} incidentId={incidentId} />
        </Box>
      </Box>
    </Box>
  );
}
