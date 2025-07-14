import React from 'react';
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:5000`,
});
const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
