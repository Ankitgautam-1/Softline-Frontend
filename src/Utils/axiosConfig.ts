import axios from "axios";
const baseURL = "https://softline-backend.adityatawade.com";
const axiosConfig = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default axiosConfig;
