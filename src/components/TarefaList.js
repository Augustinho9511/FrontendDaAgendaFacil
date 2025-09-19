import React from 'react';

const TarefaList = ({ tarefas, onEdit, onDelete, onToggleStatus }) => {
  const formatarHorario = (inicio, fim) => {
    if (!inicio || !fim) return null;
    const options = { hour: '2-digit', minute: '2-digit' };
    const horaInicio = new Date(inicio).toLocaleTimeString('pt-BR', options);
    const horaFim = new Date(fim).toLocaleTimeString('pt-BR', options);
    const dia = new Date(inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    return `${dia} | ${horaInicio} - ${horaFim}`;
  };

  if (tarefas.length === 0) {
    return (
      <div className="empty-state">
        <h2>Nenhuma tarefa encontrada.</h2>
        <p>Adicione uma nova tarefa ou limpe o filtro de data do calendário.</p>
      </div>
    );
  }

  return (
    <ul className="tarefa-list">
      {tarefas.map(tarefa => {
        const isConcluida = tarefa.status === 'Concluída';
        const dataFormatada = formatarHorario(tarefa.horarioInicio, tarefa.horarioFim);

        return (
          <li key={tarefa.id} className={isConcluida ? 'tarefa-item concluida' : 'tarefa-item'}>
            
            <div className="tarefa-check-content">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={isConcluida}
                  onChange={() => onToggleStatus(tarefa)}
                />
                <span className="checkmark"></span>
              </label>
              
              <div className="tarefa-details">
                <span className="tarefa-nome">{tarefa.nome}</span>
                {tarefa.descricao && <span className="tarefa-descricao">{tarefa.descricao}</span>}
              </div>
            </div>

            <div className="tarefa-actions">
              {dataFormatada && <span className="tarefa-data">{dataFormatada}</span>}
              <button onClick={() => onEdit(tarefa)} className="action-button edit-btn" title="Editar">
                ✏️
              </button>
              <button onClick={() => onDelete(tarefa.id)} className="action-button delete-btn" title="Excluir">
                🗑️
              </button>
            </div>

          </li>
        );
      })}
    </ul>
  );
};

export default TarefaList;