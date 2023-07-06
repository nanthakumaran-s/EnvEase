import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { getItem, setItem } from "./store.js";

const customFetch = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

customFetch.interceptors.request.use(
  async (config) => {
    const tokens = getItem("tokens");
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
      const tokens = getItem("tokens");
      if (tokens == null) {
        return Promise.reject(originalRequest);
      }

      originalRequest._retry = true;

      const resp = await refreshToken(tokens);
      setItem("tokens", resp.tokens);

      customFetch.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${resp.tokens.accessToken}`;
      return customFetch(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default customFetch;
