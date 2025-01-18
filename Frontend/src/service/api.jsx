import axios from "axios";
import { toast } from "sonner";
import { decryptToken, encryptToken } from '../utils/tokenUtils';

const BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const encryptedToken = localStorage.getItem('access_token');
        if (encryptedToken) {
            const token = decryptToken(encryptedToken);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
    
);



const refreshAccessToken = async () => {
    try {
        const encryptedRefreshToken = localStorage.getItem('refresh_token');
        
        if (!encryptedRefreshToken) {
            throw new Error('No refresh token available');
        }
        
        const decryptedRefreshToken = decryptToken(encryptedRefreshToken);
        
        // Make sure to use a new axios instance to avoid interceptors
        const response = await axios.post(
            `${BASE_URL}auth/refresh/`,
            { refresh: decryptedRefreshToken },
            { 
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );

        if (response.data.access) {
            // Store new tokens
            localStorage.setItem('access_token', encryptToken(response.data.access));
            
            if (response.data.refresh) {
                localStorage.setItem('refresh_token', encryptToken(response.data.refresh));
            }
            
            // Update axios default header
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            
            return response.data.access;
        }
        
        throw new Error('No access token received');
    } catch (error) {
        console.error('Refresh token error:', error);
        // Clear tokens on error
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        throw error;
    }
};


api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                toast.error('Session expired. Please log in again.');
                
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api; 