import React, { useState, useEffect } from 'react';

const TarefaForm = ({ onSave, tarefaToEdit, onCancel }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [horarioData, setHorarioData] = useState('');

  // Preenche o formulário quando uma tarefa é passada para edição
  useEffect(() => {
    if (tarefaToEdit) {
      setNome(tarefaToEdit.nome);
      setDescricao(tarefaToEdit.descricao);
      setStatus(tarefaToEdit.status);
      // Formata a data para o input datetime-local
      setHorarioData(tarefaToEdit.horarioData ? tarefaToEdit.horarioData.substring(0, 16) : '');
    } else {
      // Limpa o formulário para uma nova tarefa
      setNome('');
      setDescricao('');
      setStatus('Pendente');
      setHorarioData('');
    }
  }, [tarefaToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome) {
      alert('O nome da tarefa é obrigatório.');
      return;
    }

    const tarefa = {
      id: tarefaToEdit ? tarefaToEdit.id : null,
      nome,
      descricao,
      status,
      horarioData: horarioData ? `${horarioData}:00` : null, // Adiciona segundos para compatibilidade
    };
    onSave(tarefa);
  };

  return (
    <form onSubmit={handleSubmit} className="tarefa-form">
      <h2>{tarefaToEdit ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</h2>
      <div className="form-group">
        <label>Nome</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Descrição</label>
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="3" />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pendente">Pendente</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluída">Concluída</option>
        </select>
      </div>
      <div className="form-group">
        <label>Data e Horário</label>
        <input type="datetime-local" value={horarioData} onChange={(e) => setHorarioData(e.target.value)} />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="button-secondary">Cancelar</button>
        <button type="submit" className="button-primary">Salvar</button>
      </div>
    </form>
  );
};

export default TarefaForm;