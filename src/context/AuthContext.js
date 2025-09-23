import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/ApiService';

// Cria o Contexto
const AuthContext = createContext(null);

// Cria o "Provedor", o componente que vai gerenciar o estado de login
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Efeito para atualizar o estado se o token mudar em outra aba
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    const login = async (username, password) => {
        const data = await ApiService.login(username, password);
        setToken(data.token); // Atualiza o estado interno
        return data;
    };

    const logout = () => {
        ApiService.logout();
        setToken(null); // Limpa o estado interno
    };

    // Deriva o estado de autenticação a partir da existência do token
    const isAuthenticated = !!token;

    const value = {
        isAuthenticated,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Cria um "Hook" customizado para facilitar o uso do contexto em outros componentes
export const useAuth = () => {
    return useContext(AuthContext);
};