import { getItem } from "./store.js";

export const checkAuth = () => {
  const tokens = getItem("tokens");
  if (tokens) {
    return true;
  } else {
    return false;
  }
};
