import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MarkerType } from "reactflow";
import _ from "lodash";
import useAxios from "./useAxios";

export default function useWorkflow() {
    const [workflows, setWorkflows] = useState([]);
    const [activeWorkflow, setActiveWorkflow] = useState({});
    const [originalStates, setOriginalStates] = useState([]);
    const [originalTransitions, setOriginalTransitions] = useState([]);
    const [states, setStates] = useState([]);
    const [transitions, setTransitions] = useState([]);

    const { sendRequest, loading } = useAxios();

    const fetchWorkflow = useCallback(async () => {
        try {
            const response = await sendRequest({
                url: "/workflows/active",
                method: "GET",
            });

            setActiveWorkflow(response);

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
                deletable: state?.name !== "START",
                data: {
                    label:
                        fetchedStatuses.find((status) => status.id === state.statusId)?.name ??
                        state.name.toUpperCase(),
                    statusId: state.statusId,
                },
                style:
                    state?.name === "START"
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

            const transitionIndexMap = new Map();
            const newTransitions = fetchedTransitions.map((transition) => {
                const key = `${transition.fromStateId}-${transition.toStateId}`;
                const index = transitionIndexMap.get(key) || 0;
                transitionIndexMap.set(key, index + 1);

                return {
                    id: transition.id,
                    source: transition.fromStateId,
                    target: transition.toStateId,
                    label: transition.label,
                    type: "customEdge",
                    deletable: false,
                    focusable: false,
                    markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: "#5d5d5d" },
                    style: {
                        stroke: "#5d5d5d",
                        strokeWidth: 1,
                    },
                    data: {
                        label: transition.label,
                        labelStyle: {
                            fontSize: "5px",
                        },
                        index: index,
                    },
                };
            });

            setStates(newStates);
            setOriginalStates(newStates);
            setTransitions(newTransitions);
            setOriginalTransitions(newTransitions);
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
            const existingTransitions = prev.filter((t) => t.source === source.id && t.target === target.id);
            const newIndex = existingTransitions.length;

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
                    markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: "#5d5d5d" },
                    style: {
                        stroke: "#5d5d5d",
                        strokeWidth: 1,
                    },
                    data: {
                        label,
                        labelStyle: {
                            fontSize: "5px",
                        },
                        index: newIndex,
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
        setStates((prevStates) => {
            let newX = 50;
            let newY = 200;

            const xOffset = 150;
            const yOffset = 100;

            if (prevStates.length > 0) {
                const rightmostState = prevStates.reduce((prev, current) => {
                    return prev.position.x > current.position.x ? prev : current;
                });

                newX = rightmostState.position.x + xOffset;

                const canvasWidth = 800;
                if (newX > canvasWidth) {
                    newX = 50;
                    newY = rightmostState.position.y + yOffset;
                }
            }

            const newState = {
                id: `temp-${uuidv4()}`,
                position: { x: newX, y: newY },
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
            };

            return [...prevStates, newState];
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

    const deleteState = useCallback((id) => {
        setStates((prev) => {
            return prev.filter((state) => state.id !== id);
        });

        setTransitions((prev) => {
            return prev.filter((transition) => transition.source !== id && transition.target !== id);
        });
    }, []);

    const discardChanges = useCallback(() => {
        setStates(originalStates);
        setTransitions(originalTransitions);
    }, [originalStates, originalTransitions]);

    const saveChanges = useCallback(async () => {
        if (_.isEqual(originalStates, states) && _.isEqual(originalTransitions, transitions)) {
            console.log("No changes made");
            return;
        }

        try {
            const statesToAdd = states.filter((state) => state.id.startsWith("temp"));
            const statesToUpdate = states.filter(
                (state) =>
                    !state.id.startsWith("temp") &&
                    !_.isEqual(
                        state,
                        originalStates.find((originalState) => originalState.id === state.id),
                    ),
            );
            const statesToDelete = originalStates.filter(
                (originalState) => !states.find((state) => state.id === originalState.id),
            );

            const addStatePromises = statesToAdd.map(async (state) => {
                try {
                    const response = await sendRequest({
                        url: "/status",
                        method: "POST",
                        body: {
                            name: state.data.label,
                        },
                    });

                    sendRequest({
                        url: `/boards/${activeWorkflow.boardId}/status/${response.id}`,
                        method: "PUT",
                    });

                    return sendRequest({
                        url: "/states",
                        method: "POST",
                        body: {
                            name: state.data.label,
                            coordinates: {
                                x: state.position.x,
                                y: state.position.y,
                            },
                            statusId: response.id,
                        },
                    });
                } catch (error) {
                    console.log(error);
                }
            });

            statesToUpdate.map((state) => {
                return sendRequest({
                    url: `/states/${state.id}`,
                    method: "PUT",
                    body: {
                        name: state.data.label,
                        coordinates: {
                            x: state.position.x,
                            y: state.position.y,
                        },
                        statusId: state.data.statusId,
                    },
                });
            });

            statesToDelete.map((state) => {
                const deleteStatePromise = sendRequest({
                    url: `/states/${state.id}`,
                    method: "DELETE",
                });

                const deleteStatusPromise = sendRequest({
                    url: `/status/${state.statusId}`,
                    method: "DELETE",
                });

                const removeStatusFromBoardPromise = sendRequest({
                    url: `/boards/${activeWorkflow.boardId}/status/${state.statusId}`,
                    method: "DELETE",
                });

                return Promise.all([deleteStatePromise, deleteStatusPromise, removeStatusFromBoardPromise]);
            });

            const newStates = await Promise.all(addStatePromises);

            const transitionsToAdd = transitions.filter((transition) => transition.id.startsWith("temp"));
            const transitionsToDelete = originalTransitions.filter(
                (originalTransition) => !transitions.find((state) => state.id === originalTransition.id),
            );

            const newTransitionPromises = transitionsToAdd.map((transition) => {
                return sendRequest({
                    url: "/transitions",
                    method: "POST",
                    body: {
                        fromStateId: transition.source.startsWith("temp")
                            ? newStates.find(
                                  (s) => states.find((state) => state.id === transition.source).data.label === s.name,
                              ).id
                            : transition.source,
                        toStateId: transition.target.startsWith("temp")
                            ? newStates.find(
                                  (s) => states.find((state) => state.id === transition.target).data.label === s.name,
                              ).id
                            : transition.target,
                        label: transition.data.label,
                        rules: [],
                        type: null,
                    },
                });
            });

            transitionsToDelete.map((transition) => {
                return sendRequest({
                    url: `/transitions/${transition.id}`,
                    method: "DELETE",
                });
            });

            const newTransitions = await Promise.all(newTransitionPromises);

            const newTransitionsLocal = transitions.map((transition) => {
                return {
                    ...transition,
                    id: transition.id.startsWith("temp")
                        ? newTransitions.find((s) => s.label === transition.data.label).id
                        : transition.id,
                    source: transition.source.startsWith("temp")
                        ? newStates.find(
                              (s) => states.find((state) => state.id === transition.source).data.label === s.name,
                          ).id
                        : transition.source,
                    target: transition.target.startsWith("temp")
                        ? newStates.find(
                              (s) => states.find((state) => state.id === transition.target).data.label === s.name,
                          ).id
                        : transition.target,
                };
            });

            const newStatesLocal = states.map((state) => {
                return {
                    ...state,
                    id: state.id.startsWith("temp") ? newStates.find((s) => s.name === state.data.label).id : state.id,
                };
            });

            await sendRequest({
                url: `/workflows/${activeWorkflow.id}`,
                method: "PUT",
                body: {
                    name: activeWorkflow.name,
                    active: activeWorkflow.active,
                    stateIds: newStatesLocal.map((state) => state.id),
                    transitionIds: newTransitionsLocal.map((transition) => transition.id),
                    boardId: activeWorkflow.boardId,
                },
            });

            setOriginalStates(newStatesLocal);
            setOriginalTransitions(newTransitionsLocal);
            setStates(newStatesLocal);
            setTransitions(newTransitionsLocal);
        } catch (err) {
            console.log(err);
        }
    }, [
        originalStates,
        states,
        originalTransitions,
        transitions,
        activeWorkflow.id,
        activeWorkflow.name,
        activeWorkflow.active,
        activeWorkflow.boardId,
    ]);

    return {
        states,
        workflows,
        transitions,
        loading,
        fetchWorkflow,
        fetchAllWorkflows,
        updateCoordinate,
        addState,
        deleteState,
        createTransition,
        deleteTransition,
        discardChanges,
        saveChanges,
    };
}
