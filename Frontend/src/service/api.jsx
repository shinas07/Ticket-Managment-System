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
    const encryptedRefreshToken = localStorage.getItem('refresh_token');
    console.log(encryptedRefreshToken)
    
    if (!encryptedRefreshToken) {
        throw new Error('No refresh token available');
    }
    
    try {
        const decryptedRefreshToken = decryptToken(encryptedRefreshToken);
        console.log(encryptedRefreshToken)
        const response = await api.post(`auth/refresh/`, {
            refresh: decryptedRefreshToken
        });
        
        if (response.data.access) {
            const encryptedAccessToken = encryptToken(response.data.access);
            localStorage.setItem('access_token', encryptedAccessToken);
            
            if (response.data.refresh) {
                const encryptedNewRefreshToken = encryptToken(response.data.refresh);
                localStorage.setItem('refresh_token', encryptedNewRefreshToken);
            }
            
            return response.data.access;
        }
        throw new Error('No access token received');
    } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
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
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                
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