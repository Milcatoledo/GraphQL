import { useDeletePerson } from '../../hooks/hooks crud/useDeletePerson';

export const DeletePersonModal = ({ show, onClose, person, db = 'mongodb' }) => {
  const { removePerson, isLoading, error: apiError } = useDeletePerson(db);

  if (!show) return null;

  const handleDelete = async () => {
    try {
      const idToUse = person._id ?? person.id;
      await removePerson(idToUse);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar a esta persona?</p>
        
        {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
        
        <button onClick={handleDelete} disabled={isLoading} className="button-green">
          {isLoading ? 'Eliminando...' : 'Si'}
        </button>
        <button onClick={onClose} disabled={isLoading} className="button-danger">
          Cancelar
        </button>
      </div>
    </div>
  );
};
