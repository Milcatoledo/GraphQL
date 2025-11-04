const { UserInputError } = require('apollo-server-errors');

const dniRegex = /^[0-9]{10}$/;
const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
const emailRegex = /^\S+@\S+\.\S+$/;

function handleValidationError(error) {
  const errors = {};
  if (error && error.errors) {
    Object.keys(error.errors).forEach(key => {
      errors[key] = { message: error.errors[key].message };
    });
  }
  return errors;
}

function validatePersonaInput(input, isUpdate = false) {
  const errors = {};
  if (!isUpdate || (isUpdate && input.dni !== undefined)) {
    if (!input.dni || !dniRegex.test(input.dni)) {
      errors.dni = { message: 'El DNI debe contener exactamente 10 dígitos numéricos.' };
    }
  }
  if (!isUpdate || (isUpdate && input.nombres !== undefined)) {
    if (!input.nombres || !nameRegex.test(input.nombres)) {
      errors.nombres = { message: 'Los nombres solo deben contener letras y espacios, con un mínimo de 2 caracteres.' };
    }
  }
  if (!isUpdate || (isUpdate && input.apellidos !== undefined)) {
    if (!input.apellidos || !nameRegex.test(input.apellidos)) {
      errors.apellidos = { message: 'Los apellidos solo deben contener letras y espacios, con un mínimo de 2 caracteres.' };
    }
  }
  if (Object.keys(errors).length) throw new UserInputError('ValidationError', { errors });
}

function validateUserInput(input, isUpdate = false) {
  const errors = {};
  if (!isUpdate || (isUpdate && input.email !== undefined)) {
    if (!input.email || !emailRegex.test(input.email)) {
      errors.email = { message: 'Email inválido.' };
    }
  }
  if (!isUpdate || (isUpdate && input.nombre !== undefined)) {
    if (!input.nombre || input.nombre.trim().length < 1) {
      errors.nombre = { message: 'Nombre es obligatorio.' };
    }
  }
  if (!isUpdate || (isUpdate && input.apellidos !== undefined)) {
    if (!input.apellidos || input.apellidos.trim().length < 1) {
      errors.apellidos = { message: 'Apellidos son obligatorios.' };
    }
  }
  if (!isUpdate || (isUpdate && input.password !== undefined)) {
    if (!input.password || input.password.length < 6) {
      errors.password = { message: 'La contraseña debe tener al menos 6 caracteres.' };
    }
  }
  if (Object.keys(errors).length) throw new UserInputError('ValidationError', { errors });
}

module.exports = {
  handleValidationError,
  validatePersonaInput,
  validateUserInput,
};
