import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

const ProtectedRoutes = () => {
  // TODO: Use authentication token\
  const cookies = new Cookies();
  const token = cookies.get("rm-ma-token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
