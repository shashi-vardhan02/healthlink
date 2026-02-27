import axios from 'axios';

const API_URL = `http://${window.location.hostname}:5000/api`;

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export const hospitalAPI = {
    getAll: () => api.get('/hospitals'),
    getById: (id) => api.get(`/hospitals/${id}`),
};

export const doctorAPI = {
    getAll: () => api.get('/doctors'),
    getById: (id) => api.get(`/doctors/${id}`),
};

export default api;
