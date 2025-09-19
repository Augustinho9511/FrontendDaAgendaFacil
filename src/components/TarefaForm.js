import React, { useState, useEffect } from 'react';

const DIAS_SEMANA = [
  { key: 'MONDAY', label: 'S' },
  { key: 'TUESDAY', label: 'T' },
  { key: 'WEDNESDAY', label: 'Q' },
  { key: 'THURSDAY', label: 'Q' },
  { key: 'FRIDAY', label: 'S' },
  { key: 'SATURDAY', label: 'S' },
  { key: 'SUNDAY', label: 'D' },
];

const TarefaForm = ({ onSave, onSaveRecurring, tarefaToEdit, onCancel }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horarioInicio, setHorarioInicio] = useState('');
  const [horarioFim, setHorarioFim] = useState('');
  const [diasSelecionados, setDiasSelecionados] = useState([]);

  useEffect(() => {
    setDiasSelecionados([]);
    if (tarefaToEdit) {
      setNome(tarefaToEdit.nome);
      setDescricao(tarefaToEdit.descricao);
      setHorarioInicio(tarefaToEdit.horarioInicio ? tarefaToEdit.horarioInicio.substring(0, 16) : '');
      setHorarioFim(tarefaToEdit.horarioFim ? tarefaToEdit.horarioFim.substring(0, 16) : '');
    } else {
      setNome('');
      setDescricao('');
      setHorarioInicio('');
      setHorarioFim('');
    }
  }, [tarefaToEdit]);

  const handleDiaToggle = (diaKey) => {
    setDiasSelecionados(prev =>
      prev.includes(diaKey) ? prev.filter(d => d !== diaKey) : [...prev, diaKey]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome) return alert('O nome da tarefa é obrigatório.');

    if (diasSelecionados.length > 0 && !tarefaToEdit) {
      const recurringData = {
        nome,
        descricao,
        status: 'Pendente',
        diasDaSemana: diasSelecionados,
        horarioInicio: horarioInicio ? horarioInicio.split('T')[1] : '09:00',
        horarioFim: horarioFim ? horarioFim.split('T')[1] : '10:00',
      };
      onSaveRecurring(recurringData);
    } else {
      const tarefa = {
        id: tarefaToEdit ? tarefaToEdit.id : null,
        nome,
        descricao,
        status: tarefaToEdit ? tarefaToEdit.status : 'Pendente',
        horarioInicio: horarioInicio ? `${horarioInicio}:00` : null,
        horarioFim: horarioFim ? `${horarioFim}:00` : null,
      };
      onSave(tarefa);
    }
  };

  const isRecurring = diasSelecionados.length > 0 && !tarefaToEdit;
  
  // Função auxiliar para simplificar a atualização do estado do horário
  const handleTimeChange = (value, setTimeState, otherTimeState) => {
      const datePart = isRecurring ? "2025-09-13" : value.split('T')[0];
      const timePart = isRecurring ? value : (value.split('T')[1] || '');
      
      if(isRecurring){
          setTimeState(`2025-09-13T${timePart}`);
      } else {
          setTimeState(value);
      }
  };


  return (
    <form onSubmit={handleSubmit} className="tarefa-form">
      <h2>{tarefaToEdit ? 'Editar Tarefa' : 'Adicionar Tarefa'}</h2>
      
      {!tarefaToEdit && (
        <div className="form-group">
          <label>Repetir nos dias</label>
          <div className="day-selector">
            {DIAS_SEMANA.map((dia, index) => (
              <button
                type="button"
                key={index}
                className={`day-button ${diasSelecionados.includes(dia.key) ? 'selected' : ''}`}
                onClick={() => handleDiaToggle(dia.key)}
                title={dia.key}
              >
                {dia.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Nome</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Descrição</label>
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="3" />
      </div>
      
      <div className="form-group-row">
        <div className="form-group">
            <label>{isRecurring ? 'Horário de Início' : 'Data e Horário de Início'}</label>
            <input
              type={isRecurring ? 'time' : 'datetime-local'}
              value={isRecurring ? (horarioInicio.split('T')[1] || '') : horarioInicio}
              onChange={(e) => handleTimeChange(e.target.value, setHorarioInicio, horarioFim)}
              required
            />
        </div>
        <div className="form-group">
            <label>{isRecurring ? 'Horário de Fim' : 'Data e Horário de Fim'}</label>
            <input
              type={isRecurring ? 'time' : 'datetime-local'}
              value={isRecurring ? (horarioFim.split('T')[1] || '') : horarioFim}
              onChange={(e) => handleTimeChange(e.target.value, setHorarioFim, horarioInicio)}
              required
            />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="button-secondary">Cancelar</button>
        <button type="submit" className="button-primary">Salvar</button>
      </div>
    </form>
  );
};

export default TarefaForm;