import React from 'react';
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://medicins-server-side.vercel.app`,
});
const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
