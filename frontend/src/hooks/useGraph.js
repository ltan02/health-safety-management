import { useCallback, useEffect, useState } from "react";
import useAxios from "./useAxios";

export default function useGraph() {
    const [states, setStates] = useState([]);
    const [flows, setFlows] = useState([]);
    const { sendRequest } = useAxios();

    const fetchGraph = useCallback(async () => {
        try {
            const response = await sendRequest({
                // assume we only have a single workflow for now
                url: "/graphs/NqdsQ8uIyGnlWgN2dI2o",
                method: "GET",
            });
            const newStates = []
            const newFlow = []
            Promise.all(
                response.states.map(async (id) => {
                    const res = await sendRequest({
                        url: `/state/${id}`,
                        method: "GET",
                    });
                    const node = {
                        id: res.id,
                        position: { x: res.coordinate.x, y: res.coordinate.y },
                        data: { label: res.name },
                    }
                    newStates.push(node);
                })
            ).then(() => {
                setStates(newStates);
            });
            Promise.all(
                response.flows.map(async (id) => {
                    const res = await sendRequest({
                        url: `/flow/${id}`,
                        method: "GET",
                    });
                    const flow = {
                        id: res.id,
                        source: res.from,
                        target: res.to,
                        label: res.name,
                    }
                    newFlow.push(flow);
                })
            ).then(() => {
                setFlows(newFlow);
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const updateCoordinate = useCallback(async (id, coordinate) => {
        try {
            await sendRequest({
                url: `/state/${id}`,
                method: "PUT",
                body: {
                    "coordinate": {
                        "x": coordinate.x,
                        "y": coordinate.y
                    }
                }
            });
            console.log("update coordinate success");
        } catch (error) {
            console.log(error);
        }
    }, [states, flows]);

    const createFlow = useCallback(async (source, target, label = null) => {
        try {
            const flow = await sendRequest({
                url: `/flow`,
                method: "POST",
                body: {
                    "from": source,
                    "to": target,
                    "name": label
                }
            });
            await sendRequest({
                url: `/graphs/NqdsQ8uIyGnlWgN2dI2o/addFlow`,
                method: "POST",
                body: {
                   id: flow.id
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [states, flows]);

    const deleteFlow = useCallback(async (id) => {
        try {
            await sendRequest({
                url: `/flow/${id}`,
                method: "DELETE"
            });
            await sendRequest({
                url: `/graphs/NqdsQ8uIyGnlWgN2dI2o/deleteFlow/${id}`,
                method: "DELETE",
                body: {
                   id: id
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [states, flows]);

    return { states, flows, fetchGraph, updateCoordinate, createFlow, deleteFlow };
}