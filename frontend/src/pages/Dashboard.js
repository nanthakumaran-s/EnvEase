import React, { useEffect } from "react";
import useAxios from "../hooks/useAxios";

const Dashboard = () => {
  const [data, error, loading, trigger] = useAxios("GET", "/user", {});

  useEffect(() => {
    trigger();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return data && <div>{data.user.name}</div>;
};

export default Dashboard;
