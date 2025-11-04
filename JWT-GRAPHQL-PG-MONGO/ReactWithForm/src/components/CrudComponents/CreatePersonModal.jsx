import React, { useState } from 'react';
import { useCreatePerson } from '../../hooks/hooks crud/useCreatePerson';
import { PersonForm } from './Form';
export const CreatePersonModal = ({ show, onClose, db = 'mongo' }) => {
  const { createPerson, isLoading, error: apiError } = useCreatePerson();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const dniRegex = /^[0-9]{10}$/;
    const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    if (!formData.dni || !dniRegex.test((formData.dni || '').toString().trim())) newErrors.dni = 'El DNI debe contener exactamente 10 dígitos numéricos.';
    if (!formData.nombres || !nameRegex.test((formData.nombres || '').toString().trim())) newErrors.nombres = 'Los nombres solo deben contener letras y espacios, mínimo 2 caracteres.';
    if (!formData.apellidos || !nameRegex.test((formData.apellidos || '').toString().trim())) newErrors.apellidos = 'Los apellidos solo deben contener letras y espacios, mínimo 2 caracteres.';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    try {
      await createPerson(formData, db);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Crear Nueva Persona ({db === 'mongo' ? 'MongoDB' : 'Postgres'})</h2>
        <form onSubmit={handleSubmit}>
          <PersonForm formData={formData} handleChange={handleChange} errors={errors} />
          
          <br />
          <button type="submit" disabled={isLoading} className="button-green">
            {isLoading ? 'Creando...' : 'Crear Persona'}
          </button>
          <button type="button" onClick={onClose} className='button-danger' >Cancelar</button>
        </form>
        {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
      </div>
    </div>
  );
};
