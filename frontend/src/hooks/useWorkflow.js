import { useCallback, useState } from "react";
import useAxios from "./useAxios";
import useStatus from "./useStatus";

export default function useWorkflow() {
  const [states, setStates] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [callbackStack, setCallbackStack] = useState([]);
  const { statuses, fetchStatus } = useStatus();

  const { sendRequest, loading } = useAxios();

  const pushCallback = useCallback((callback) => {
    setCallbackStack((prev) => [...prev, callback]);
  }, []);

  const applyCallbacks = useCallback(async () => {
    try {
      for (const callback of callbackStack) {
        await callback();
      }
      setCallbackStack([]);
    } catch (error) {
      console.error("An error occurred while applying callbacks:", error);
    }
  }, [callbackStack]);

  const discardCallbacks = () => {
    setCallbackStack([]);
  };

  const fetchWorkflow = useCallback(async () => {
    try {
      await fetchStatus();
      const response = await sendRequest({
        // assume we only have a single worktransition for now
        url: "/workflows/i3iOjBN8AAbz9txF5M9B",
        method: "GET",
      });
      const newStates = [];
      const newTransitions = [];

      response.states.forEach((state) => {
        const newState = {
          id: state.id,
          position: {
            x: state.coordinate?.x ?? 0,
            y: state.coordinate?.y ?? 0,
          },
          data: { label: state.name },
          style: {
            background: `${
              statuses[state.statusId]
                ? statuses[state.statusId].color
                : "#000000"
            }`,
            border: `solid 2px ${
              statuses[state.statusId]
                ? statuses[state.statusId].color
                : "#000000"
            }`,
            fontWeight: "bold",
          },
        };
        newStates.push(newState);
      });

      response.transitions.forEach((transition) => {
        const newTransition = {
          id: transition.id,
          source: transition.fromStateId,
          target: transition.toStateId,
          label: transition.name,
          type: "smoothstep",
          arrowHeadType: "arrowclosed",
        };
        newTransitions.push(newTransition);
      });
      setStates(newStates);
      setTransitions(newTransitions);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const updateCoordinate = useCallback(
    async (id, coordinate) => {
      try {
        await sendRequest({
          url: `/workflows/i3iOjBN8AAbz9txF5M9B/coordinate/${id}`,
          method: "PUT",
          body: {
            x: coordinate.x,
            y: coordinate.y,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [states, transitions]
  );

  const createTransition = useCallback(
    async (source, target, label = null) => {
      console.log({ source, target, label })
      try {
        await sendRequest({
          url: `/workflows/i3iOjBN8AAbz9txF5M9B/transition`,
          method: "POST",
          body: {
            fromStateId: source,
            toStateId: target,
            name: label,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [states, transitions]
  );

  const deleteTransition = useCallback(
    async (id) => {
      try {
        await sendRequest({
          url: `/workflows/i3iOjBN8AAbz9txF5M9B/transition/${id}`,
          method: "DELETE",
        });
      } catch (error) {
        console.log(error);
      }
    },
    [states, transitions]
  );

  const organizeCoordinates = useCallback(() => {
    let currentY = 0;
    const yIncrement = 100;

    const newCoordinates = {};

    transitions.forEach((transition) => {
      if (!newCoordinates[transition.source]) {
        newCoordinates[transition.source] = { x: 100, y: currentY };
        currentY += yIncrement;
      }
      if (!newCoordinates[transition.target]) {
        newCoordinates[transition.target] = { x: 100, y: currentY };
        currentY += yIncrement;
      }
    });

    currentY = 0;
    states.forEach((state) => {
      if (!newCoordinates[state.id]) {
        newCoordinates[state.id] = { x: 300, y: currentY };
        currentY += yIncrement;
      }
    });

    const newStates = states.map((state) => {
      if (newCoordinates[state.id]) {
        return { ...state, position: newCoordinates[state.id] };
      }
      return state;
    });

    setStates(newStates);
    newStates.forEach((state) => {
      pushCallback(() => updateCoordinate(state.id, state.position));
    });
  }, [states, transitions, setStates, updateCoordinate, pushCallback]);

  const deleteState = useCallback(
    async (id) => {
      try {
        await sendRequest({
          url: `/workflows/i3iOjBN8AAbz9txF5M9B/state/${id}`,
          method: "DELETE",
        });
      } catch (error) {
        console.log(error);
      }
    },
    [states, transitions]
  );

  return {
    states,
    statuses,
    transitions,
    loading,
    fetchWorkflow,
    updateCoordinate,
    deleteState,
    createTransition,
    deleteTransition,
    pushCallback,
    applyCallbacks,
    discardCallbacks,
    organizeCoordinates,
  };
}
