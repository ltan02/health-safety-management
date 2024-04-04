import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import useAxios from "../hooks/useAxios";
import { useBoard } from "./BoardContext";

const WorkflowContext = createContext();

export const useWorkflowNew = () => useContext(WorkflowContext);

export const WorkflowProvider = ({ children }) => {
    const { boardDetails } = useBoard();
    const [activeWorkflow, setActiveWorkflow] = useState({});
    const [activeStateMap, setActiveStateMap] = useState({});
    const [activeTransitionMap, setActiveTransitionMap] = useState({});
    const [flowMap, setFlowMap] = useState({});
    const { sendRequest } = useAxios();

    const fetchWorkflow = useCallback(async () => {
        if (boardDetails && Object.keys(boardDetails).length > 0) {
            const workflowResponse = await sendRequest({ url: `/workflows/${boardDetails.activeWorkflowId}` });

            setActiveWorkflow(workflowResponse);

            const statePromises = workflowResponse.stateIds.map((id) =>
                sendRequest({
                    url: `/states/${id}`,
                    method: "GET",
                }),
            );

            const transitionPromises = workflowResponse.transitionIds.map((id) =>
                sendRequest({
                    url: `/transitions/${id}`,
                    method: "GET",
                }),
            );

            const fetchedStates = await Promise.all(statePromises);
            const fetchedTransitions = await Promise.all(transitionPromises);

            const stateMap = fetchedStates.reduce((acc, state) => {
                acc[state.id] = state;
                return acc;
            }, {});

            const transitionMap = fetchedTransitions.reduce((acc, transition) => {
                acc[transition.id] = transition;
                return acc;
            }, {});

            setActiveTransitionMap(transitionMap);
            setActiveStateMap(stateMap);
            setFlowMap(
                fetchedTransitions.reduce((acc, transition) => {
                    if (stateMap[transition.fromStateId].name !== "START") {
                        const statusId = stateMap[transition.fromStateId].statusId;
                        if (!acc[statusId]) {
                            acc[statusId] = [];
                        }

                        if (transition.toStateId) {
                            acc[statusId].push({
                                toStateId: transition.toStateId,
                                transitionId: transition.id,
                            });
                        }
                    }

                    return acc;
                }, {}),
            );
        }
    }, [boardDetails]);

    useEffect(() => {
        fetchWorkflow();
    }, [fetchWorkflow]);

    console.log("activeWorkflow", activeWorkflow);
    console.log("activeStateMap", activeStateMap);
    console.log("activeTransitionMap", activeTransitionMap);
    console.log("flowMap", flowMap);

    const value = useMemo(
        () => ({ activeWorkflow, activeStateMap, activeTransitionMap, flowMap }),
        [activeStateMap, activeTransitionMap, activeWorkflow, flowMap],
    );

    return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
};
