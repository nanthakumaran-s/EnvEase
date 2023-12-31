import { useState } from "react";

import { BASE_URL } from "../utils/constants";
import axios from "axios";

const customFetch = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

const useAxios = (method, url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  customFetch.interceptors.request.use(
    async (config) => {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      if (tokens) {
        config.headers["Authorization"] = `bearer ${tokens.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshToken = async (tokens) => {
    try {
      const resp = await customFetch.post("session/refresh-tokens", {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      return resp.data;
    } catch (e) {
      setError(e);
    }
  };

  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.code === "ERR_NETWORK" && !originalRequest._retry) {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        if (tokens == null) {
          return Promise.reject(originalRequest);
        }

        originalRequest._retry = true;

        const resp = await refreshToken(tokens);
        localStorage.setItem("tokens", JSON.stringify(resp.tokens));

        customFetch.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${resp.tokens.accessToken}`;
        return customFetch(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  const trigger = async (reqData = {}) => {
    setLoading(true);
    try {
      if (method === "GET") {
        const { data: response } = await customFetch({
          method: method,
          url: url,
          params: reqData,
        });
        setData(response);
      } else {
        const { data: response } = await customFetch({
          method: method,
          url: url,
          data: reqData,
        });
        setData(response);
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const remove = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, error, loading, trigger, remove };
};

export default useAxios;
