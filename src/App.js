import React, { useState, useEffect } from 'react';
import ApiService from './services/ApiService';
import TarefaList from './components/TarefaList';
import TarefaForm from './components/TarefaForm';
import Modal from './components/Modal';
import './App.css';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarefaAtual, setTarefaAtual] = useState(null); // Para edição

  const fetchTarefas = () => {
    setIsLoading(true);
    ApiService.getAllTarefas()
      .then(response => {
        // Ordena as tarefas para que as pendentes/em andamento apareçam primeiro
        const sortedTarefas = response.data.sort((a, b) => {
          if (a.status === 'Concluída' && b.status !== 'Concluída') return 1;
          if (a.status !== 'Concluída' && b.status === 'Concluída') return -1;
          return new Date(b.horarioData) - new Date(a.horarioData);
        });
        setTarefas(sortedTarefas);
        setError(null);
      })
      .catch(err => {
        setError('Falha ao carregar tarefas. Verifique se a API está online.');
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  const handleOpenModal = (tarefa = null) => {
    setTarefaAtual(tarefa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTarefaAtual(null);
  };

  const handleSaveTarefa = (tarefa) => {
    const promise = tarefa.id
      ? ApiService.updateTarefa(tarefa.id, tarefa)
      : ApiService.createTarefa(tarefa);

    promise
      .then(() => {
        fetchTarefas();
        handleCloseModal();
      })
      .catch(err => {
        setError('Erro ao salvar a tarefa.');
        console.error(err);
      });
  };

  const handleDeleteTarefa = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      ApiService.deleteTarefa(id)
        .then(() => {
          setTarefas(tarefas.filter(t => t.id !== id));
        })
        .catch(err => {
          setError('Erro ao excluir a tarefa.');
          console.error(err);
        });
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container header-content">
          <h1 className="app-title">AgendaFácil</h1>
          <button onClick={() => handleOpenModal()} className="button-primary add-task-btn">
            + Nova Tarefa
          </button>
        </div>
      </header>
      <main className="container">
        {isLoading && <div className="loading-spinner"></div>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && (
          <TarefaList
            tarefas={tarefas}
            onEdit={handleOpenModal}
            onDelete={handleDeleteTarefa}
          />
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TarefaForm
          onSave={handleSaveTarefa}
          tarefaToEdit={tarefaAtual}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default App;
