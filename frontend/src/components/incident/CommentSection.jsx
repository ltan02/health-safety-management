import React, { useEffect, useRef, useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";

export default function CommentSection({ commentData = [], incidentId }) {
  const containerRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1);
  const sortComments = (comments) => {
    if (!comments) return [];
    return comments.sort(
      (a, b) =>  new Date(b.comment.timestamp) - new Date(a.comment.timestamp),
    );
  };
  const [comments, setComments] = useState(sortComments(commentData[incidentId]));

  const dateFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    const checkOverflow = () => {
      const current = containerRef.current;
      if (current) {
        setIsOverflow(current.scrollHeight > current.clientHeight);
      }
    };

    window.addEventListener("resize", checkOverflow);
    checkOverflow();
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    setComments(sortComments(commentData[incidentId]));
    return () => window.removeEventListener("resize", checkOverflow);
  }, [commentData]);

  useEffect(() => {
    const handleScroll = () => {
      const current = containerRef.current;
      if (current) {
        const currentScroll = current.scrollTop;
        const opacity = 1 - currentScroll / 50;
        setScrollIndicatorOpacity(Math.max(opacity, 0));
      }
    };

    const current = containerRef.current;
    current?.addEventListener("scroll", handleScroll);
    containerRef.current.scrollTop = containerRef.current.scrollHeight;

    return () => current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{

        maxHeight: "300px",
        position: "relative",
        "&::after": {
          // content: isOverflow ? '"Scroll for more ↓"' : '""',
          position: "absolute",
          bottom: 0,
          right: 0,
          padding: "4px",
          fontSize: "0.75rem",
          color: "secondary.main",
          backgroundColor: "background.paper",
          borderTopLeftRadius: "4px",
          opacity: scrollIndicatorOpacity,
          transition: "opacity 0.3s ease",
        },
      }}
    >
      <Grid container spacing={2}>
        {comments.map((data) => (
          <Grid item xs={12} key={data.id} style={{ marginBottom: "16px" }}>
            <Grid
              container
              alignItems="center"
              gap={1}
              style={{ marginBottom: "8px" }}
            >
              <Avatar
                sx={{
                  bgcolor: "#DB536A",
                  width: "30px",
                  height: "30px",
                  fontSize: "14px",
                }}
              >
                {`${data.user?.firstName[0]}${data.user?.lastName[0]}`}
              </Avatar>
              <Grid item>
                <Typography
                  variant="caption"
                  color="secondary.dark"
                  fontWeight={600}
                >
                  {data.user.firstName} {data.user.lastName}
                </Typography>
                <Typography
                  variant="caption"
                  color="secondary.dark"
                  style={{ display: "block", marginBottom: "1px" }}
                >
                  {dateFromTimestamp(data.comment.timestamp)}
                </Typography>
              </Grid>
            </Grid>
            <Grid item style={{ marginLeft: "40px" }}>
              <Typography variant="body2">{data.comment.content}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
