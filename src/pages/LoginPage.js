import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ApiService from '../services/ApiService'; // Certifique-se que o caminho está correto

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Limpa erros antigos
        try {
            await ApiService.login(username, password);
            navigate('/tarefas'); // Redireciona para a página de tarefas após o login
        } catch (err) {
            setError('Falha no login. Verifique seu usuário e senha.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h2>Entrar na sua Agenda</h2>
                <form onSubmit={handleLogin}>
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
                    <button type="submit" className="button-primary">Entrar</button>
                </form>
                <p className="auth-link">
                    Não tem uma conta? <Link to="/register">Registre-se</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;