import { useCallback, useEffect, useState } from "react";
import useAxios from "./useAxios";

export default function useGraph() {
    const [states, setStates] = useState([]);
    const [transitions, setTransitions] = useState([]);
    const [callbackStack, setCallbackStack] = useState([]);
    const { sendRequest, loading } = useAxios();

    const pushCallback = (callback) => {
        setCallbackStack((prev) => [...prev, callback]);
    };

    const applyCallbacks = () => {
        callbackStack.forEach((callback) => callback());
        setCallbackStack([]);
    };

    const discardCallbacks = () => {
        setCallbackStack([]);
    };

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
      }, [states, transitions, setStates]);
      

    const fetchGraph = useCallback(async () => {
        try {
            const response = await sendRequest({
                // assume we only have a single worktransition for now
                url: "/workflows/i3iOjBN8AAbz9txF5M9B",
                method: "GET",
            });
            const newStates = []
            const newTransitions = []

            response.states.forEach((state) => {
                const newState = {
                    id: state.id,
                    position: { x: state.coordinate.x, y: state.coordinate.y },
                    data: { label: state.name },
                }
                newStates.push(newState);
            });

            response.transitions.forEach((transition) => {
                const newTransition = {
                    id: transition.id,
                    source: transition.fromStateId,
                    target: transition.toStateId,
                    label: null,
                    type: 'smoothstep',
                }
                newTransitions.push(newTransition);
            });
            setStates(newStates);
            setTransitions(newTransitions);

        } catch (error) {
            console.log(error);
        }
    }, []);

    const updateCoordinate = useCallback(async (id, coordinate) => {
        try {
            console.log(id, coordinate)
            await sendRequest({
                url: `/workflows/i3iOjBN8AAbz9txF5M9B/coordinate/${id}`,
                method: "PUT",
                body: {
                    "x": coordinate.x,
                    "y": coordinate.y
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [states, transitions]);

    const createTransition = useCallback(async (source, target, label = null) => {
        try {
            console.log(source);
            await sendRequest({
                url: `/workflows/i3iOjBN8AAbz9txF5M9B/transition`,
                method: "POST",
                body: {
                    "fromStateId": source,
                    "toStateId": target,
                    "name": label
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [states, transitions]);

    const deleteTransition = useCallback(async (id) => {
        try {
            await sendRequest({
                url: `/workflows/i3iOjBN8AAbz9txF5M9B/transition/${id}`,
                method: "DELETE"
            });
        } catch (error) {
            console.log(error);
        }
    }, [states, transitions]);

    return { states, transitions, loading, fetchGraph, updateCoordinate, createTransition, deleteTransition, pushCallback, applyCallbacks, discardCallbacks, organizeCoordinates };
}