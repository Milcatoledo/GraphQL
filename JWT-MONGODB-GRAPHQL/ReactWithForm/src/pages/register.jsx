import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

export const RegisterUser = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        try {
            const res = await register(data);
            if (res && res.token) {
                navigate('/');
            }
        } catch (err) {
            console.error('Error registro:', err);
            alert(err.response?.data?.message || err.message || 'Error al registrar');
        }
    };

    return (
        <div className="register-page">
            <AuthForm onSubmit={handleRegister} />
        </div>
    )
};

export default RegisterUser;
