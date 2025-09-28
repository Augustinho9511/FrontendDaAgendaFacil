import React from 'react';

const ChecklistItemView = ({ item, onToggle }) => (
    <div className={`checklist-item ${item.concluido ? 'concluido' : ''}`}>
        <label className="checkbox-container-small">
            <input type="checkbox" checked={item.concluido} onChange={() => onToggle(item.id)} />
            <span className="checkmark-small"></span>
        </label>
        <span>{item.texto}</span>
    </div>
);

const TaskList = ({ tarefas, onEdit, onDelete, onToggleStatus, onToggleChecklistItem }) => {

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
                        <div className="tarefa-header">
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
                                {tarefa.descricao && <p className="tarefa-descricao">{tarefa.descricao}</p>}
                            </div>
                        </div>

                        {tarefa.checklistItems && tarefa.checklistItems.length > 0 && (
                            <div className="checklist-view">
                                {tarefa.checklistItems.map(item => (
                                    <ChecklistItemView
                                        key={item.id}
                                        item={item}
                                        onToggle={(itemId) => onToggleChecklistItem(tarefa.id, itemId)}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="tarefa-footer">
                            <div>
                                {dataFormatada && <span className="tarefa-data">{dataFormatada}</span>}
                            </div>
                            <div className="tarefa-actions">
                                <button onClick={() => onEdit(tarefa)} className="action-button" title="Editar">✏️</button>
                                <button onClick={() => onDelete(tarefa.id)} className="action-button" title="Excluir">🗑️</button>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default TaskList;