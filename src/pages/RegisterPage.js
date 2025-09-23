import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ApiService from '../services/ApiService';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 4) {
            setError('A senha deve ter pelo menos 4 caracteres.');
            return;
        }

        try {
            await ApiService.register(username, password);
            setSuccess('Conta criada com sucesso! Redirecionando para o login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            // Nova lógica para tratar os erros corretamente
            if (err.response) {
                if (err.response.status === 400) { // Erro 400: Usuário já existe
                    setError('Nome de usuário já existe. Tente outro.');
                } else if (err.response.status === 403) { // Erro 403: Acesso proibido
                    setError('Erro de permissão no servidor. A rota de registro pode estar protegida.');
                } else { // Outros erros
                    setError('Ocorreu um erro inesperado. Tente novamente.');
                }
            } else {
                setError('Não foi possível conectar ao servidor.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h2>Crie sua Conta</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="username">Nome de Usuário</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="auth-error-message">{error}</p>}
                    {success && <p className="auth-success-message">{success}</p>}
                    <button type="submit" className="button-primary">Registrar</button>
                </form>
                <p className="auth-link">
                    Já tem uma conta? <Link to="/login">Faça o login</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;