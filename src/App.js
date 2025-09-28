import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// 1. IMPORTAR O PROVEDOR DE AUTENTICAÇÃO
import { AuthProvider } from './context/AuthContext'; 

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TarefasPage from './pages/TarefasPage';
import PrivateRoute from './components/PrivateRoute';

import { Toaster } from 'react-hot-toast';
// 2. IMPORTAR O ARQUIVO DE ESTILOS CSS
import './App.css'; 

function App() {
    return (

        <AuthProvider>
            <Toaster
                position="top-right" // Posição na tela
                toastOptions={{
                    duration: 4000, // Duração de 4 segundos
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route 
                        path="/tarefas" 
                        element={
                            <PrivateRoute>
                                <TarefasPage />
                            </PrivateRoute>
                        } 
                    />
                    {/* Redireciona qualquer outra rota para o login por padrão */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;