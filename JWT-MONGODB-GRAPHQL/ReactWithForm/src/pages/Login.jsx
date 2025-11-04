import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../components/FormField';
import { useAuth } from '../context/useAuth';

export const Login = ({ onBack }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            if (res && res.token) {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error', err);
            alert(err.response?.data?.message || 'Credenciales inválidas');
        }
    };

    return (
        <div className="login-page" style={{ maxWidth: 640, margin: '24px auto' }}>
        <form onSubmit={handleSubmit} className="auth-form" style={{ padding: 20 }}>
            <h2 className="auth-form__title">Iniciar sesión</h2>
            <FormField 
            label="Correo" 
            name="email" type="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="correo@ejemplo.com" 
            />

            <FormField 
            label="Contraseña" 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                    <button type="submit" className="button-green">Entrar</button>
                    <button
                        type="button"
                        onClick={() => (onBack ? onBack() : navigate('/register'))}
                        className='auth-form__link'
                    >
                        Registrarse
                    </button>
                </div>
        </form>
        </div>
    );
};

export default Login;
