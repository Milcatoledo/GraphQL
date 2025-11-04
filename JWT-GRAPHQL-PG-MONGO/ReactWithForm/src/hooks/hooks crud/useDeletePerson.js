import { useState } from 'react';
import { deletePerson as deletePersonApi } from '../../Api/personsApi';

export const useDeletePerson = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePerson = async (id, db = 'mongo') => {
    setIsLoading(true);
    setError(null);
    try {
      await deletePersonApi(id, db);
    } catch (err) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePerson, isLoading, error };
};
