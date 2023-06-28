import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  useEffect(() => {
    const userTokens = localStorage.getItem("tokens");
    if (userTokens) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return isLoggedIn === undefined ? (
    <p>Loading</p>
  ) : isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
