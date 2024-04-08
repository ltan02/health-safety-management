import { SwipeableDrawer } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

const InvalidStateSidebar = ({ open, invalidStates, states }) => {
    return (
        <SwipeableDrawer
            ModalProps={{ keepMounted: true }}
            anchor="right"
            open={open}
            onOpen={() => {}}
            onClose={() => {}}
            variant="persistent"
            sx={{
                "& .MuiDrawer-paper": {
                    width: 350,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    top: "98px",
                    height: "calc(100% - 98px)",
                    zIndex: 1,
                    padding: 2,
                    justifyContent: "space-between",
                },
            }}
        >
            <div style={{ display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 500 }}>Errors</h3>
                <p style={{ color: "#626F86", fontSize: "11px" }}>
                    You can&apos;t save this workflow until the following errors are resolved.
                </p>

                <h4 style={{ fontSize: "14px", fontWeight: 500, marginTop: 10 }}>These statuses need a transition</h4>
                <p style={{ color: "#626F86", fontSize: "11px" }}>
                    No one can move issues into these statuses because they&apos;re disconnected from the main flow. Add
                    a transition leading into them. Select a status to give it an incoming transition.
                </p>

                <div style={{ marginTop: 10 }}>
                    {invalidStates.map((stateId) => (
                        <div
                            key={stateId}
                            style={{
                                border: "1px solid #7D7D7D",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "5px",
                                marginBottom: 10,
                                borderRadius: "2px",
                            }}
                        >
                            <p style={{ fontSize: "14px" }}>
                                {states.find((state) => state.id === stateId)?.data?.label || ""}
                            </p>
                            <ErrorIcon sx={{ color: "#F00" }} />
                        </div>
                    ))}
                </div>
            </div>
        </SwipeableDrawer>
    );
};

export default InvalidStateSidebar;
