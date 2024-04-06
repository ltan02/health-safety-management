import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { alpha } from "@mui/material/styles";

export default function DroppableTransitionBox({ statusId, statusName, transitionName }) {
    const { setNodeRef, isOver } = useDroppable({ id: statusId });

    return (
        <Box
            ref={setNodeRef}
            sx={{
                display: "flex",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid #D04A02",
                backgroundColor: isOver ? alpha("#EB8C00", 0.4) : alpha("#EB8C00", 0.1),
            }}
        >
            <p style={{ margin: 0, fontSize: 14 }}>{transitionName}</p>
            <div style={{ display: "flex", alignItems: "center" }}>
                <ArrowForwardIcon sx={{ width: "16px", height: "16px" }} />
                <p
                    style={{
                        margin: 0,
                        fontSize: 11,
                        border: "1.5px solid #000",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        display: "inline-block",
                    }}
                >
                    {statusName}
                </p>
            </div>
        </Box>
    );
}
