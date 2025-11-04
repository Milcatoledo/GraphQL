const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server-errors');
const { validateUserInput, handleValidationError } = require('./validators');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

module.exports = {
  Mutation: {
    register: async (_, { nombre, apellidos, email, password }) => {
      try {
        validateUserInput({ nombre, apellidos, email, password }, false);
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) throw new ApolloError('El correo ya está registrado.', 'DUPLICATE', { field: 'email' });
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ nombre: nombre.trim(), apellidos: apellidos.trim(), email: email.toLowerCase().trim(), password: hashed });
        const token = jwt.sign({ userId: user._id, email: user.email, nombre: user.nombre, apellidos: user.apellidos }, JWT_SECRET, { expiresIn: '1h' });
        return token;
      } catch (error) {
        try { console.error('Register resolver error:', error && (error.stack || error)); } catch (e) { }
        if (error instanceof UserInputError) throw error;
        if (error.code === '23505') throw new ApolloError('El correo ya está registrado.', 'DUPLICATE', { field: 'email' });
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },

    login: async (_, { email, password }) => {
      try {
        if (!email || !password) throw new UserInputError('Faltan credenciales.');
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) throw new AuthenticationError('Credenciales inválidas.');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new AuthenticationError('Credenciales inválidas.');
        const token = jwt.sign({ userId: user._id, email: user.email, nombre: user.nombre, apellidos: user.apellidos }, JWT_SECRET, { expiresIn: '1h' });
        return token;
      } catch (error) {
        try { console.error('Login resolver error:', error && (error.stack || error)); } catch (e) { }
        if (error instanceof UserInputError || error instanceof AuthenticationError) throw error;
        throw new ApolloError(error.message || 'Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    }
  }
};
