import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import ApiService from '../services/ApiService';
import TarefaList from '../components/TarefaList';
import TarefaForm from '../components/TarefaForm';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext'; // Importamos para usar o logout

function TarefasPage() {
    // --- Estados da Página ---
    const [tarefas, setTarefas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState(document.body.className || 'light');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tarefaAtual, setTarefaAtual] = useState(null);

    // --- Hooks de Navegação e Autenticação ---
    const navigate = useNavigate();
    const { logout } = useAuth();

    // --- Efeitos ---
    useEffect(() => {
        fetchTarefas();
    }, []);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    // --- Funções de API ---
    const fetchTarefas = () => {
        setIsLoading(true);
        ApiService.getAllTarefas()
            .then(response => setTarefas(response.data))
            .catch(err => {
                console.error(err);
                setError('Falha ao carregar tarefas.');
            })
            .finally(() => setIsLoading(false));
    };

    // --- Manipuladores de Eventos (Handlers) ---
    const handleSaveTarefa = (tarefa) => {
        const promise = tarefa.id
            ? ApiService.updateTarefa(tarefa.id, tarefa)
            : ApiService.createTarefa(tarefa);

        promise.then(() => {
            fetchTarefas();
            handleCloseModal();
        }).catch(err => setError('Erro ao salvar a tarefa.'));
    };

    const handleSaveRecurringTarefa = (recurringData) => {
        ApiService.createRecurringTarefa(recurringData)
            .then(() => {
                fetchTarefas();
                handleCloseModal();
            })
            .catch(err => setError('Erro ao salvar as tarefas recorrentes.'));
    };

    const handleDeleteTarefa = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            ApiService.deleteTarefa(id)
                .then(() => fetchTarefas())
                .catch(err => setError('Erro ao excluir a tarefa.'));
        }
    };

    const handleToggleStatus = (tarefa) => {
        const novoStatus = tarefa.status === 'Concluída' ? 'Pendente' : 'Concluída';
        const tarefaAtualizada = { ...tarefa, status: novoStatus };

        setTarefas(tarefas.map(t => t.id === tarefa.id ? tarefaAtualizada : t));
        ApiService.updateTarefa(tarefa.id, tarefaAtualizada)
            .catch(() => {
                setError('Erro ao atualizar status.');
                fetchTarefas();
            });
    };
    
    // --- LÓGICA DO LOGOUT ---
    const handleLogout = () => {
        logout(); // Limpa o token do context/localstorage
        navigate('/login'); // Redireciona para a página de login
    };

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    const handleDateChange = date => setSelectedDate(date);
    const clearDateFilter = () => setSelectedDate(null);
    const handleOpenModal = (tarefa = null) => {
        setTarefaAtual(tarefa);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    // --- Lógica de Filtragem e Marcação (Memoizada para Performance) ---
    const filteredTarefas = useMemo(() => {
        const sortedTarefas = [...tarefas].sort((a, b) => {
            if (a.status === 'Concluída' && b.status !== 'Concluída') return 1;
            if (a.status !== 'Concluída' && b.status === 'Concluída') return -1;
            if (a.horarioInicio && b.horarioInicio) return new Date(a.horarioInicio) - new Date(b.horarioInicio);
            return 0;
        });

        if (!selectedDate) return sortedTarefas;

        return sortedTarefas.filter(tarefa => {
            if (!tarefa.horarioInicio) return false;
            const tarefaDate = new Date(tarefa.horarioInicio);
            return tarefaDate.getFullYear() === selectedDate.getFullYear() &&
                tarefaDate.getMonth() === selectedDate.getMonth() &&
                tarefaDate.getDate() === selectedDate.getDate();
        });
    }, [selectedDate, tarefas]);

    const markDaysWithTasks = ({ date, view }) => {
        if (view === 'month') {
            const hasTask = tarefas.some(tarefa => {
                if (!tarefa.horarioInicio) return false;
                const tarefaDate = new Date(tarefa.horarioInicio);
                return tarefaDate.getFullYear() === date.getFullYear() &&
                    tarefaDate.getMonth() === date.getMonth() &&
                    tarefaDate.getDate() === date.getDate();
            });
            if (hasTask) return <div className="task-marker"></div>;
        }
        return null;
    };


    return (
        <>
            <header className="app-header">
                <div className="container header-content">
                    <h1 className="app-title">Minhas Tarefas</h1>
                    <div>
                        <button onClick={toggleTheme} className="theme-toggle" title="Mudar tema">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button onClick={() => handleOpenModal()} className="button-primary">
                            + Adicionar Tarefa
                        </button>
                        {/* BOTÃO DE LOGOUT */}
                        <button onClick={handleLogout} className="button-secondary">
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="container main-layout">
                <div className="calendar-container">
                    <h2>Calendário</h2>
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileContent={markDaysWithTasks}
                        locale="pt-BR"
                    />
                    {selectedDate && (
                        <button onClick={clearDateFilter} className="clear-filter-btn">
                            Limpar filtro
                        </button>
                    )}
                </div>

                <div className="task-list-section">
                    <h2>{selectedDate ? `Tarefas para ${selectedDate.toLocaleDateString('pt-BR')}` : 'Todas as Tarefas'}</h2>
                    {isLoading && <p>Carregando...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!isLoading && !error && (
                        <TarefaList
                            tarefas={filteredTarefas}
                            onEdit={handleOpenModal}
                            onDelete={handleDeleteTarefa}
                            onToggleStatus={handleToggleStatus}
                        />
                    )}
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <TarefaForm
                    onSave={handleSaveTarefa}
                    onSaveRecurring={handleSaveRecurringTarefa}
                    tarefaToEdit={tarefaAtual}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </>
    );
}

export default TarefasPage;