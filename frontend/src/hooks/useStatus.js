
import { useState } from "react";
import useAxios from "./useAxios";

export default function  useStatus() {
    const [statuses, setStatuses] = useState({});

    const { sendRequest } = useAxios();

    const fetchStatus = async () => {
        const response = await sendRequest({
            url: "/status",
        });
        response.map((status) => {
           const statusMap = {
            [status.id]: {
                name: status.name,
                color: status.color,
            }
           }
           Object.assign(statuses, statusMap);
           setStatuses(statuses);
        });
    }

    return {fetchStatus, statuses};

}