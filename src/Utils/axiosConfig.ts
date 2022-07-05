import axios from 'axios';
const baseURL = 'https://softline-backend.adityatawade.com:3001';
const axiosConfig = axios.create({
	baseURL: baseURL,
	withCredentials: true,
});

export default axiosConfig;
