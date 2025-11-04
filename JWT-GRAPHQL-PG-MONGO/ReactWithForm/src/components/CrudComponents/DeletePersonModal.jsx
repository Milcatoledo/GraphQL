import React from 'react';
import { useDeletePerson } from '../../hooks/hooks crud/useDeletePerson';

export const DeletePersonModal = ({ show, onClose, person, db = 'mongo' }) => {
  const { deletePerson, isLoading, error: apiError } = useDeletePerson();

  if (!show) return null;

  const handleDelete = async () => {
    try {
      await deletePerson(person._id, db);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Eliminar Persona ({db === 'mongo' ? 'MongoDB' : 'Postgres'})</h2>
        <p>¿Seguro que desea eliminar a <strong>{person.nombres} {person.apellidos}</strong>?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleDelete} className="button-danger" disabled={isLoading}>{isLoading ? 'Eliminando...' : 'Eliminar'}</button>
          <button onClick={onClose} className="button-green">Cancelar</button>
        </div>
        {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
      </div>
    </div>
  );
};
