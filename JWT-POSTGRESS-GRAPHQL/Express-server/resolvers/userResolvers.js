const User = require('../models/user');
const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server-errors');
const { validateUserInput, handleValidationError } = require('./validators');

module.exports = {
  Query: {
    getUsers: async (_, { limit = 100, offset = 0 }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        const maxLimit = Math.min(limit, 1000);
        return await User.find({}, { limit: maxLimit, offset });
      } catch (error) {
        if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) throw error;
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },
    getUser: async (_, { id }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        const user = await User.findById(id);
        if (!user) throw new ApolloError('No encontrado', 'NOT_FOUND');
        return { _id: user._id, nombre: user.nombre, apellidos: user.apellidos, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
      } catch (error) {
        if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) throw error;
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },
    me: async (_, __, { user }) => {
      try {
        if (!user) return null;
        return await User.findById(user.userId);
      } catch (error) {
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    }
  },

  Mutation: {
    createUser: async (_, { input }) => {
      try {
        validateUserInput(input, false);
        const { nombre, apellidos, email, password } = input;
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) throw new ApolloError('El correo ya está registrado.', 'DUPLICATE', { field: 'email' });
        const hashed = await require('bcryptjs').hash(password, 10);
        const user = await User.create({ nombre: nombre.trim(), apellidos: apellidos.trim(), email: email.toLowerCase().trim(), password: hashed });
        return { _id: user._id, nombre: user.nombre, apellidos: user.apellidos, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        if (error.code === '23505') throw new ApolloError('El correo ya está registrado.', 'DUPLICATE', { field: 'email' });
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },

    updateUser: async (_, { id, input }) => {
      try {
        validateUserInput(input, true);
        if (input.password) {
          input.password = await require('bcryptjs').hash(input.password, 10);
        }
        const user = await User.findByIdAndUpdate(id, input);
        if (!user) throw new ApolloError('No encontrado', 'NOT_FOUND');
        return { _id: user._id, nombre: user.nombre, apellidos: user.apellidos, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        if (error.code === '23505') throw new ApolloError('El correo ya está registrado.', 'DUPLICATE', { field: 'email' });
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },

    deleteUser: async (_, { id }) => {
      try {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new ApolloError('No encontrado', 'NOT_FOUND');
        return true;
      } catch (error) {
        if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) throw error;
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    }
  }
};
