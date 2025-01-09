import axios from 'axios';

import { API_ENDPOINT } from 'configs/AppConfig';
import { useAuth } from "contexts/AuthContext";
// Tạo instance axios
const apiClient = axios.create({
    baseURL: API_ENDPOINT,
    timeout: 30000, // Timeout 30s
});
// const { login } = useAuth();
// Hàm refresh token
// Loại bỏ useAuth ra khỏi hàm async
const refreshToken = async () => {

    console.log('Attempting to refresh token...');

    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        const response = await axios.post(`${API_ENDPOINT}/api/auth/refresh-token`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
        });

        if (response.status === 200) {

            console.log('response.data.data.token:', response.data.data);

            // Sử dụng login truyền từ ngoài vào
            // login(response.data.data);
            const accessToken = response.data.data.token;
            const refreshToken = response.data.data.refreshToken;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            // login({ token: accessToken, refreshToken: newRefreshToken, ...user });
            console.log('Token refreshed:', accessToken);
            return accessToken;
        }
    } catch (error) {
        console.error('Refresh token failed:', error);

        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
        return null;
    }
};


// Interceptor thêm token vào request
apiClient.interceptors.request.use(
    async (config) => {
        if (!config.url.includes('/api/public')) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        if (config.method === 'get' && !config.url.includes('uploads')) {
            // config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor xử lý 401 (Unauthorized)
apiClient.interceptors.response.use(
    (response) => {
        // console.log('response:');

        // console.log('#############response:', response);

        return response;  // Trả response đã sửa đổi
    },
    async (error) => {
        // console.log('error:', error);
        // console.log('error.response?.status:', error.response);

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshToken();
            if (newToken) {
                apiClient.defaults.headers['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

// Hàm GET
export const get = async (endpoint, params = {}, needJwt = false) => {
    const config = { params };
    if (needJwt) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = { 'Authorization': `Bearer ${token}` };
        }
    }
    return apiClient.get(endpoint, config);
};

// Hàm POST
export const post = async (endpoint, data, needJwt = false) => {
    const config = {};
    if (needJwt) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = { 'Authorization': `Bearer ${token}` };
        }
    }
    return apiClient.post(endpoint, data, config);
};

// Hàm PUT
export const put = async (endpoint, data, needJwt = false) => {
    const config = {};
    if (needJwt) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = { 'Authorization': `Bearer ${token}` };
        }
    }
    return apiClient.put(endpoint, data, config);
};

// Hàm DELETE
export const del = async (endpoint, needJwt = false) => {
    const config = {};
    if (needJwt) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = { 'Authorization': `Bearer ${token}` };
        }
    }
    return apiClient.delete(endpoint, config);
};
