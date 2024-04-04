import { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function useAxios() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [aiLoading, setAILoading] = useState(false);
    const [aiError, setAIError] = useState(null);

    const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const aiBaseUrl = import.meta.env.VITE_AI_URL;

    const refreshToken = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const token = await currentUser.getIdToken(true);
            sessionStorage.setItem("token", token);
            return token;
        }
        return null;
    };

    const sendRequest = async ({ url, method = "GET", body = null }) => {
        setLoading(true);
        setError(null);
        try {
            let token = sessionStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            };

            const config = {
                method,
                url: `${baseUrl}${url}`,
                headers,
                data: body,
            };
            const response = await axios(config);
            if (response.status === 401 || response.status === 403) {
                const newToken = await refreshToken();
                if (newToken) {
                    token = newToken;
                    headers.Authorization = `Bearer ${token}`;
                    config.headers = headers;
                    return axios(config);
                }
            }

            return response.data;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const sendAIRequest = async ({ url, method = "GET", body = null , id}) => {
        setAILoading(true);
        setAIError(null);
        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                "uuid": id,
            };

            const config = {
                method,
                url: `${aiBaseUrl}${url}`,
                headers,
                data: body,
            };

            const response = await axios(config);
            return response.data;
        } catch (err) {
            setAIError(err);
        } finally {
            setAILoading(false);
        }
    };

    return { loading, error, sendRequest, aiLoading, aiError, sendAIRequest };
}
