import React, { createContext, useState, useContext, useEffect } from 'react';
import ApiService from '../services/ApiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // --- LÓGICA DE AUTENTICAÇÃO (EXISTENTE) ---
    const [token, setToken] = useState(localStorage.getItem('token'));
    const isAuthenticated = !!token;

    const login = async (username, password) => {
        const data = await ApiService.login(username, password);
        setToken(data.token);
        return data;
    };

    const logout = () => {
        ApiService.logout();
        setToken(null);
    };

    // --- NOVA LÓGICA DE TEMA ---
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        // Aplica a classe do tema no corpo do documento e salva no localStorage
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    // --- FIM DA NOVA LÓGICA ---


    // Juntamos tudo que queremos compartilhar com a aplicação no 'value'
    const value = {
        isAuthenticated,
        login,
        logout,
        theme,      // <-- Compartilha o tema atual
        toggleTheme // <-- Compartilha a função para trocar o tema
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para usar tudo isso
export const useAuth = () => {
    return useContext(AuthContext);
};