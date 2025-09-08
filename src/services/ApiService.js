import axios from 'axios';

// URL base da sua API. Ajuste a porta se necessário.
const API_URL = 'http://localhost:8080/api/tarefa';

const getAllTarefas = () => {
    return axios.get(`${API_URL}/Listar`);
};

const createTarefa = (tarefa) => {
    return axios.post(`${API_URL}/Create`, tarefa);
};

const updateTarefa = (id, tarefa) => {
    // Note o /Update/${id} que corresponde à correção no backend
    return axios.put(`${API_URL}/Update/${id}`, tarefa);
};

const deleteTarefa = (id) => {
    // Note o /Delete/${id} que corresponde à correção no backend
    return axios.delete(`${API_URL}/Delete/${id}`);
};

const apiService = {
    getAllTarefas,
    createTarefa,
    updateTarefa,
    deleteTarefa,
};

export default apiService;