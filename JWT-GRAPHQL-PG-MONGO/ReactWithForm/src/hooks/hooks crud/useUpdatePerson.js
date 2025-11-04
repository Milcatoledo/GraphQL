import { useState } from 'react';
import { updatePerson as updatePersonApi } from '../../Api/personsApi';

export const useUpdatePerson = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePerson = async (id, personData, db = 'mongo') => {
    setIsLoading(true);
    setError(null);
    try {

      const payload = { ...personData };
      if (payload._id !== undefined) delete payload._id;
      await updatePersonApi(id, payload, db);
    } catch (err) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const validationErrors = err.response.data.errors;
          errorMessage = Object.values(validationErrors)
            .map(error => error.message)
            .join(' ');
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePerson, isLoading, error };
};
