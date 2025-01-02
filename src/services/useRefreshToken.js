import { useAuth } from "contexts/AuthContext";
import axios from 'axios';
import { API_ENDPOINT } from 'configs/AppConfig';

const useRefreshToken = () => {
    const { login } = useAuth();

    const refreshToken = async () => {
        console.log('Attempting to refresh token...');
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token found');

            const response = await axios.post(`${API_ENDPOINT}/api/auth/refresh-token`, {}, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`,
                },
            });

            if (response.status === 200) {
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                login(response.data.data);
                return accessToken;
            }
        } catch (error) {
            console.error('Refresh token failed:', error);
            return null;
        }
    };

    return refreshToken;
};

export default useRefreshToken;
