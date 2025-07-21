import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import Loader from "./Loader";

const PrivateRoutes = ({ children }) => {
  const { user,lodaing } = useAuth();
  const location = useLocation();
  if(lodaing){
    return <Loader></Loader>;
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default PrivateRoutes;
