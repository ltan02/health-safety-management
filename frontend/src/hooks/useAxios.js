import { useState } from "react";
import axios from "axios";
import { auth } from '../firebase';

export default function useAxios() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const baseUrl = import.meta.env.VITE_APP_BACKEND_URL;

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
          return response.data;
      } catch (err) {
          if (err.response && err.response.status === 401) {
              const newToken = await refreshToken();
              if (newToken) {
                  return sendRequest({ url, method, body });
              }
          }
          setError(err);
      } finally {
          setLoading(false);
      }
  };

  return { loading, error, sendRequest };
}
