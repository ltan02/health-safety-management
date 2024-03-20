import { useCallback, useState } from "react";
import useAxios from "./useAxios";
import { v4 as uuidv4 } from "uuid";

export default function useWorkflow() {
    const [workflows, setWorkflows] = useState([]);
    const [states, setStates] = useState([]);
    const [transitions, setTransitions] = useState([]);

    const { sendRequest, loading } = useAxios();

    const fetchWorkflow = useCallback(async () => {
        try {
            const response = await sendRequest({
                url: "/workflows/active",
                method: "GET",
            });

            const statePromises = response.stateIds.map((id) =>
                sendRequest({
                    url: `/states/${id}`,
                    method: "GET",
                }),
            );

            const transitionPromises = response.transitionIds.map((id) =>
                sendRequest({
                    url: `/transitions/${id}`,
                    method: "GET",
                }),
            );

            const fetchedStates = await Promise.all(statePromises);

            const statusPromises = fetchedStates
                .filter((state) => state.statusId !== null)
                .map((state) => {
                    return sendRequest({
                        url: `/status/${state.statusId}`,
                        method: "GET",
                    });
                });

            const fetchedTransitions = await Promise.all(transitionPromises);
            const fetchedStatuses = await Promise.all(statusPromises);

            const newStates = fetchedStates.map((state) => ({
                id: state.id,
                position: {
                    x: state.coordinates?.x ?? 0,
                    y: state.coordinates?.y ?? 0,
                },
                deletable: state?.name !== "Start",
                data: {
                    label:
                        fetchedStatuses.find((status) => status.id === state.statusId)?.name ??
                        state.name.toUpperCase(),
                },
                style:
                    state?.name === "Start"
                        ? {
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              background: "#234377",
                              color: "#ffffff",
                              fontWeight: 500,
                              fontSize: "5px",
                              padding: 0,
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                          }
                        : {
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              background: "#ffffff",
                              border: "1px solid #000000",
                              fontWeight: 500,
                              fontSize: "6px",
                              padding: 0,
                              width: 75,
                              height: 20,
                          },
            }));

            const newTransitions = fetchedTransitions.map((transition) => ({
                id: transition.id,
                source: transition.fromStateId,
                target: transition.toStateId,
                label: transition.label,
                type: "customEdge",
                deletable: false,
                focusable: false,
                markerEnd: { type: "arrow", color: "#5d5d5d" },
                style: {
                    stroke: "#5d5d5d",
                    strokeWidth: 1,
                },
                data: {
                    label: transition.label,
                    labelStyle: {
                        fontSize: "5px",
                    },
                },
            }));

            setStates(newStates);
            setTransitions(newTransitions);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const updateCoordinate = useCallback((id, coordinate) => {
        setStates((prev) => {
            return prev.map((state) => {
                if (state.id === id) {
                    return { ...state, position: coordinate };
                }
                return state;
            });
        });
    }, []);

    const createTransition = useCallback((source, target, label = null) => {
        setTransitions((prev) => {
            return [
                ...prev,
                {
                    id: `temp-${uuidv4()}`,
                    source: source.id,
                    target: target.id,
                    label,
                    type: "customEdge",
                    deletable: false,
                    focusable: false,
                    markerEnd: { type: "arrow", color: "#5d5d5d" },
                    style: {
                        stroke: "#5d5d5d",
                        strokeWidth: 1,
                    },
                    data: {
                        label,
                        labelStyle: {
                            fontSize: "5px",
                        },
                    },
                },
            ];
        });
    }, []);

    const deleteTransition = useCallback((id) => {
        setTransitions((prev) => {
            return prev.filter((transition) => transition.id !== id);
        });
    }, []);

    const addState = useCallback((name) => {
        setStates((prev) => {
            return [
                ...prev,
                {
                    id: `temp-${uuidv4()}`,
                    position: { x: 0, y: 0 },
                    data: { label: name },
                    style: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#ffffff",
                        border: "1px solid #000000",
                        fontWeight: 500,
                        fontSize: "6px",
                        padding: 0,
                        width: 75,
                        height: 20,
                    },
                },
            ];
        });
    }, []);

    const fetchAllWorkflows = useCallback(async () => {
        try {
            const response = await sendRequest({
                url: "/workflows",
                method: "GET",
            });
            setWorkflows(response);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const organizeCoordinates = useCallback(() => {
        let currentY = 0;
        const yIncrement = 100;
        const xPositionSource = 300;
        const xPositionState = 300;
        const newCoordinates = {};

        transitions.forEach((transition) => {
            if (!newCoordinates[transition.source]) {
                newCoordinates[transition.source] = { x: xPositionSource, y: currentY };
                currentY += yIncrement;
            }
            if (!newCoordinates[transition.target]) {
                newCoordinates[transition.target] = { x: xPositionSource, y: currentY };
                currentY += yIncrement;
            }
        });

        states.forEach((state) => {
            if (!newCoordinates[state.id]) {
                newCoordinates[state.id] = { x: xPositionState, y: currentY };
                currentY += yIncrement;
            }
        });

        const newStates = states.map((state) =>
            newCoordinates[state.id] ? { ...state, position: newCoordinates[state.id] } : state,
        );

        setStates(newStates);

        // newStates.forEach((state) => {
        //     pushCallback(() => updateCoordinate(state.id, state.position));
        // });
    }, [states, transitions]);

    const deleteState = useCallback((id) => {
        setStates((prev) => {
            return prev.filter((state) => state.id !== id);
        });

        setTransitions((prev) => {
            return prev.filter((transition) => transition.source !== id && transition.target !== id);
        });
    }, []);

    return {
        states,
        workflows,
        transitions,
        loading,
        fetchWorkflow,
        fetchAllWorkflows,
        updateCoordinate,
        deleteState,
        createTransition,
        deleteTransition,
        organizeCoordinates,
        addState,
    };
}
