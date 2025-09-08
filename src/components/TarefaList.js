import React from 'react';

const TarefaList = ({ tarefas, onEdit, onDelete }) => {
  const formatarData = (dataString) => {
    if (!dataString) return 'Sem data agendada';
    const options = {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    };
    return new Date(dataString).toLocaleString('pt-BR', options);
  };

  if (tarefas.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '4rem', color: '#A0A0A0' }}>Tudo limpo! Adicione uma nova tarefa para começar.</p>;
  }

  return (
    <div className="tarefa-list-container">
      {tarefas.map(tarefa => (
        <div key={tarefa.id} className={`tarefa-card status-${tarefa.status.toLowerCase().replace(' ', '-')}`}>
          <div className="tarefa-header">
            <h3>{tarefa.nome}</h3>
            <span className={`status-badge status-${tarefa.status.toLowerCase().replace(' ', '-')}`}>{tarefa.status}</span>
          </div>
          <div className="tarefa-body">
            <p>{tarefa.descricao || 'Sem descrição.'}</p>
          </div>
          <div className="tarefa-footer">
            <span className="tarefa-datetime">{formatarData(tarefa.horarioData)}</span>
            <div className="tarefa-actions">
                <button onClick={() => onEdit(tarefa)} className="button-edit">Editar</button>
                <button onClick={() => onDelete(tarefa.id)} className="button-danger">Excluir</button>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TarefaList;