const Persona = require('../models/persona');
const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server-errors');
const { validatePersonaInput, handleValidationError } = require('./validators');

module.exports = {
  Query: {
    getPersonas: async (_, { limit = 100, offset = 0 }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        const maxLimit = Math.min(limit, 1000);
        return await Persona.find({}, { limit: maxLimit, offset });
      } catch (error) {
        if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) throw error;
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },
    getPersona: async (_, { id }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        const persona = await Persona.findById(id);
        if (!persona) throw new ApolloError('No encontrado', 'NOT_FOUND');
        return persona;
      } catch (error) {
        if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) throw error;
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    }
  },

  Mutation: {
    createPersona: async (_, { input }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        if (input.dni) input.dni = input.dni.trim();
        if (input.nombres) input.nombres = input.nombres.trim();
        if (input.apellidos) input.apellidos = input.apellidos.trim();

        validatePersonaInput(input, false);

        const persona = await Persona.create(input);
        return persona;
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        if (error.code === '23505') {
          throw new ApolloError('El DNI ingresado ya se encuentra registrado.', 'DUPLICATE', { field: 'dni' });
        }
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },

    updatePersona: async (_, { id, input }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');

        validatePersonaInput(input, true);

        const persona = await Persona.findByIdAndUpdate(id, input);
        if (!persona) throw new ApolloError('No encontrado', 'NOT_FOUND');
        return persona;
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        if (error.code === '23505') {
          throw new ApolloError('El DNI ingresado ya pertenece a otra persona.', 'DUPLICATE');
        }
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },

    deletePersona: async (_, { id }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        const persona = await Persona.findByIdAndDelete(id);
        if (!persona) throw new ApolloError('No encontrado', 'NOT_FOUND');
        return true;
      } catch (error) {
        if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) throw error;
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    }
  }
};
