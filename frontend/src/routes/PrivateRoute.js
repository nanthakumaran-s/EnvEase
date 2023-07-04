/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../state/user.atom";

const PrivateRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { data, error, trigger } = useAxios("GET", "/user");
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    if (data) {
      console.log(data);
      setUser({
        name: data.user.name,
        email: data.user.email,
        twoFactor: data.user.twoFactor,
        enterprise: {
          id: data.user.enterprise.id,
          name: data.user.enterprise.name,
          imgUrl: data.user.enterprise.imageUrl,
        },
        role: {
          id: data.user.role.id,
          role: data.user.role.role,
        },
      });
      setIsLoggedIn(true);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      //TODO: Handle Error
      setIsLoggedIn(false);
    }
  }, [error]);

  useEffect(() => {
    const userTokens = localStorage.getItem("tokens");
    if (userTokens) {
      trigger();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return isLoggedIn === undefined ? (
    <p>Loading</p>
  ) : isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" />
  );
};

export default PrivateRoute;
