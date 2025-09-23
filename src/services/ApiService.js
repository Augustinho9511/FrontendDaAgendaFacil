import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL
});

// Interceptor que adiciona o token em todas as requisições autenticadas
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Funções de Autenticação ---
const register = (username, password) => {
    return axios.post(`${API_URL}/api/auth/register`, { username, password });
};

const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

// --- Funções de Tarefas (usando a instância 'api' segura) ---
const getAllTarefas = () => api.get('/api/tarefas');
const createTarefa = (tarefa) => api.post('/api/tarefas', tarefa);
const updateTarefa = (id, tarefa) => api.put(`/api/tarefas/${id}`, tarefa);
const deleteTarefa = (id) => api.delete(`/api/tarefas/${id}`);
const createRecurringTarefa = (recurringData) => api.post('/api/tarefas/recorrente', recurringData);


const ApiService = {
    register,
    login,
    logout,
    getAllTarefas,
    createTarefa,
    updateTarefa,
    deleteTarefa,
    createRecurringTarefa // <-- A função que faltava exportar
};

export default ApiService;