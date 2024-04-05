import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingBar({ loading=true, top, left, expectedDuration }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer;
    if (loading) {
      const startTime = Date.now();
      setIsVisible(true); // Make sure the bar is visible when loading starts

      timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const updatedProgress = Math.min((elapsedTime / expectedDuration) * 100, 100);
        setProgress(updatedProgress);
        if (updatedProgress >= 100) {
          clearInterval(timer);
          // Start the fade out after a delay
          setTimeout(() => setIsVisible(false), 1000); // Delay before starting to hide
        }
      }, 100);
    } else {
      setIsVisible(false); // Immediately start hiding if not loading
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [loading, expectedDuration]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: top,
        left: left,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "orange",
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden",
        transition: "opacity 0.5s linear, visibility 0s linear 0.5s"
      }}
    >
      <CircularProgress
        variant="determinate"
        value={progress}
        color="inherit"
        size={60}
        thickness={2}
      />
      <Typography
        variant="caption"
        sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        fontSize={18}
        fontWeight={100}
      >
        {`${Math.round(progress)}%`}
      </Typography>
    </Box>
  );
}
