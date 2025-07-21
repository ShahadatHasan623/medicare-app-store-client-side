import axios from "axios";
import React from "react";
import useAuth from "./useAuth";

const axioseSecure = axios.create({
  baseURL: `http://localhost:5000`,
});
const useAxioseSecure = () => {
  const { user } = useAuth();
  axioseSecure.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return axioseSecure;
};

export default useAxioseSecure;
