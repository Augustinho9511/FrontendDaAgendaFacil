import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tarefa';

const getAllTarefas = () => {
    return axios.get(`${API_URL}/Listar`);
};

const createTarefa = (tarefa) => {
    return axios.post(`${API_URL}/Create`, tarefa);
};

const updateTarefa = (id, tarefa) => {
    return axios.put(`${API_URL}/Update/${id}`, tarefa);
};

const deleteTarefa = (id) => {
    return axios.delete(`${API_URL}/Delete/${id}`);
};

const createRecurringTarefa = (recurringData) => {
    return axios.post(`${API_URL}/CreateRecurring`, recurringData);
};

const apiService = {
    getAllTarefas,
    createTarefa,
    updateTarefa,
    deleteTarefa,
    createRecurringTarefa,
};

export default apiService;