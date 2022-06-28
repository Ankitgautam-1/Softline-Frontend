import axios from 'axios';
const baseURL = 'http://localhost:3001';
const axiosConfig = axios.create({
	baseURL: baseURL,
	withCredentials: true,
});

export default axiosConfig;
