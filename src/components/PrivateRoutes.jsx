import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const PrivateRoutes = ({ children }) => {
  const { user,lodaing } = useAuth();
  const location = useLocation();
  if(lodaing){
    return "loading...."
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default PrivateRoutes;
