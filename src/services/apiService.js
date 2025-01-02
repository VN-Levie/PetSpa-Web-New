import axios from 'axios';

import { API_ENDPOINT } from 'configs/AppConfig';

// Tạo instance axios
const apiClient = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // Timeout 30s
});

// Hàm refresh token
const refreshToken = async () => {
    console.log('Refresh token');

    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        const response = await axios.post(`${API_ENDPOINT}/auth/refresh-token`, {
            refresh_token: refreshToken,
        });

        if (response.status === 200) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            return token;
        }
    } catch (error) {
        console.error('Refresh token failed', error);
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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor xử lý 401 (Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('Error:', error);
        console.log('error.response?.status:', error.response?.status);

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
