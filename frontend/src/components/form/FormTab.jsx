import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function PreviewFormTab({ labels, children }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="workflow tabs"
      >
        {labels.map((label, index) => (
          <Tab key={index} label={label} value={index} />
        ))}
      </Tabs>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} style={{ display: value === index ? "block" : "none" }}>
            {child}
          </div>
        ))}
      </Box>
    </Box>
  );
}
