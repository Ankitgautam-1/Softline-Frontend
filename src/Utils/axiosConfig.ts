import axios from 'axios';
const env = import.meta.env.VITE_TEST_ENV;

const axiosConfig = axios.create({
	baseURL: env,
	withCredentials: true,
});

export default axiosConfig;
