import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import toast from 'react-hot-toast';

// Imports dos nossos próprios módulos e componentes
import ApiService from '../services/ApiService';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import TarefaForm from '../components/TarefaForm';
import Modal from '../components/Modal';

function TarefasPage() {
    // --- Estados da Página ---
    const [tarefas, setTarefas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tarefaAtual, setTarefaAtual] = useState(null);

    // --- Hooks ---
    const navigate = useNavigate();
    const { logout, theme, toggleTheme } = useAuth();

    // --- Efeitos ---
    useEffect(() => {
        fetchTarefas();
    }, []);

    // --- Funções de Comunicação com a API ---
    const fetchTarefas = () => {
        setIsLoading(true);
        ApiService.getAllTarefas()
            .then(response => {
                // Garante que 'tarefas' seja sempre uma lista, nunca undefined.
                setTarefas(response.data || []);
            })
            .catch(err => {
                console.error("Erro ao buscar tarefas:", err);
                toast.error('Falha ao carregar tarefas.');
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    handleLogout();
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // --- Handlers ---
    const handleSaveTarefa = (tarefa) => {
        const promise = tarefa.id
            ? ApiService.updateTarefa(tarefa.id, tarefa)
            : ApiService.createTarefa(tarefa);

        toast.promise(
            promise.then(() => {
                fetchTarefas();
                handleCloseModal();
            }),
            {
                loading: 'Salvando tarefa...',
                success: <b>Tarefa salva com sucesso!</b>,
                error: <b>Não foi possível salvar a tarefa.</b>,
            }
        );
    };

    const handleSaveRecurringTarefa = (recurringData) => {
        const promise = ApiService.createRecurringTarefa(recurringData);
        toast.promise(
            promise.then(() => {
                fetchTarefas();
                handleCloseModal();
            }),
            {
                loading: 'Criando tarefas recorrentes...',
                success: <b>Tarefas recorrentes criadas!</b>,
                error: <b>Erro ao criar tarefas.</b>,
            }
        );
    };

    const handleDeleteTarefa = (id) => {
        const promise = ApiService.deleteTarefa(id).then(() => {
            // Remove a tarefa da lista localmente para uma resposta visual instantânea
            setTarefas(tarefasAtuais => tarefasAtuais.filter(t => t.id !== id));
        });

        toast.promise(promise, {
            loading: 'Excluindo...',
            success: 'Tarefa excluída!',
            error: (err) => {
                fetchTarefas(); // Reverte a exclusão visual se o backend falhar
                return 'Erro ao excluir a tarefa.';
            },
        });
    };

    const handleToggleStatus = (tarefa) => {
        const novoStatus = tarefa.status === 'Concluída' ? 'Pendente' : 'Concluída';
        const tarefaAtualizada = { ...tarefa, status: novoStatus };

        setTarefas(currentTarefas => currentTarefas.map(t => t.id === tarefa.id ? tarefaAtualizada : t));
        
        ApiService.updateTarefa(tarefa.id, tarefaAtualizada)
            .catch(() => {
                toast.error('Erro ao atualizar status.');
                fetchTarefas();
            });
    };

    const handleToggleChecklistItem = (tarefaId, checklistItemId) => {
        setTarefas(currentTarefas => currentTarefas.map(tarefa => {
            if (tarefa.id === tarefaId) {
                return {
                    ...tarefa,
                    checklistItems: tarefa.checklistItems.map(item =>
                        item.id === checklistItemId ? { ...item, concluido: !item.concluido } : item
                    )
                };
            }
            return tarefa;
        }));

        ApiService.toggleChecklistItem(checklistItemId)
            .catch(err => {
                toast.error('Falha ao atualizar o item do checklist.');
                fetchTarefas();
            });
    };

    const handleLogout = () => {
        logout();
        toast.success('Você saiu com sucesso!');
        navigate('/login');
    };

    const handleDateChange = date => setSelectedDate(date);
    const clearDateFilter = () => setSelectedDate(null);
    const handleOpenModal = (tarefa = null) => {
        setTarefaAtual(tarefa);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);


    const filteredTarefas = useMemo(() => {
        if (!tarefas) return [];
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
        if (!tarefas) return null;
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
                    <h1 className="app-title">AgendaFácil</h1>
                    <div className="header-actions">
                        <button onClick={toggleTheme} className="theme-toggle" title="Mudar tema">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button onClick={() => handleOpenModal()} className="button-primary">
                            + Adicionar Tarefa
                        </button>
                        <button onClick={handleLogout} className="button-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                            </svg>
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
                    
                    {!isLoading && (
                        <TaskList
                            tarefas={filteredTarefas || []} // Garante que nunca seja undefined
                            onEdit={handleOpenModal}
                            onDelete={handleDeleteTarefa}
                            onToggleStatus={handleToggleStatus}
                            onToggleChecklistItem={handleToggleChecklistItem}
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