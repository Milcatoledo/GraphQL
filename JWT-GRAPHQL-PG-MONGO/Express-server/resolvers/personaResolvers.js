const PersonaMongo = require('../models/mongo/persona');
const PersonaPg = require('../models/pg/persona');
const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server-errors');
const { validatePersonaInput, handleValidationError } = require('./validators');

function chooseModel(db) {
  if (db === 'pg' || db === 'postgres' || db === 'postgresql') return { type: 'pg', model: PersonaPg };
  return { type: 'mongo', model: PersonaMongo };
}

module.exports = {
  Query: {
    getPersonas: async (_, { limit = 100, offset = 0, db }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        const maxLimit = Math.min(limit, 1000);
        const chosen = chooseModel(db);
        if (chosen.type === 'mongo') {
          return await chosen.model.find().skip(offset).limit(maxLimit);
        }

        return await chosen.model.find({}, { limit: maxLimit, offset });
      } catch (error) {
        if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) throw error;
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },

    getPersona: async (_, { id, db }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        const chosen = chooseModel(db);
        const persona = await chosen.model.findById(id);
        if (!persona) throw new ApolloError('No encontrado', 'NOT_FOUND');
        return persona;
      } catch (error) {
        if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) throw error;
        if (error.kind === 'ObjectId' || /Cast to ObjectId/.test(error.message)) throw new UserInputError('Id inválido');
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    }
  },

  Mutation: {
    createPersona: async (_, { input, db }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        if (input.dni) input.dni = input.dni.trim();
        if (input.nombres) input.nombres = input.nombres.trim();
        if (input.apellidos) input.apellidos = input.apellidos.trim();

        validatePersonaInput(input, false);

        const chosen = chooseModel(db);
        if (chosen.type === 'mongo') {
          const persona = new chosen.model(input);
          await persona.save();
          return persona;
        }
        const persona = await chosen.model.create(input);
        return persona;
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        if (error.code === 11000 || error.code === '23505') {
          throw new ApolloError('El DNI ingresado ya se encuentra registrado.', 'DUPLICATE', { field: 'dni' });
        }
        if (error.name === 'ValidationError') {
          throw new UserInputError('ValidationError', { errors: handleValidationError(error) });
        }
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },

    updatePersona: async (_, { id, input, db }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');

        validatePersonaInput(input, true);

        const chosen = chooseModel(db);
        const persona = await chosen.model.findByIdAndUpdate(id, input, chosen.type === 'mongo' ? { new: true, runValidators: true } : undefined);
        if (!persona) throw new ApolloError('No encontrado', 'NOT_FOUND');
        return persona;
      } catch (error) {
        if (error instanceof UserInputError) throw error;
        if (error.name === 'ValidationError') {
          throw new UserInputError('ValidationError', { errors: handleValidationError(error) });
        }
        if (error.code === 11000 || error.code === '23505') {
          throw new ApolloError('El DNI ingresado ya pertenece a otra persona.', 'DUPLICATE');
        }
        if (error.kind === 'ObjectId' || /Cast to ObjectId/.test(error.message)) throw new UserInputError('Id inválido');
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    },

    deletePersona: async (_, { id, db }, context) => {
      try {
        if (context && context.authError) throw new AuthenticationError(context.authError);
        if (!context || !context.user) throw new AuthenticationError('Token requerido');
        const chosen = chooseModel(db);
        const persona = await chosen.model.findByIdAndDelete(id);
        if (!persona) throw new ApolloError('No encontrado', 'NOT_FOUND');
        return true;
      } catch (error) {
        if (error instanceof UserInputError || error instanceof AuthenticationError || error instanceof ApolloError) throw error;
        if (error.kind === 'ObjectId' || /Cast to ObjectId/.test(error.message)) throw new UserInputError('Id inválido');
        throw new ApolloError('Error interno del servidor.', 'INTERNAL_SERVER_ERROR');
      }
    }
  }
};
