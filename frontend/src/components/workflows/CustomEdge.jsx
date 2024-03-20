import { getMarkerEnd, getSmoothStepPath } from "reactflow";

const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
    const markerEndId = getMarkerEnd(markerEnd, id);

    return (
        <>
            <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEndId} />
            <foreignObject width={65} height={50} x={labelX - 32.5} y={labelY - 7.5} style={{ overflow: "visible" }}>
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #5d5d5d",
                        borderRadius: "10px",
                        padding: "2px 5px",
                        textAlign: "center",
                        fontSize: data.labelStyle?.fontSize || "10px",
                    }}
                >
                    {data.label}
                </div>
            </foreignObject>
        </>
    );
};

export default CustomEdge;
