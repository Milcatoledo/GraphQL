import { useState, useCallback, useEffect } from 'react';
import { getPersons } from '../../Api/personsApi';

export const useFetchPersons = (db = 'mongo') => {
    const [persons, setPersons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPersons = useCallback(async (dbArg = db) => {
        setIsLoading(true);
        setError(null);
        try {
        const data = await getPersons(dbArg);
        setPersons(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Falló la carga de personas:', err);
            setError('No se pudieron cargar las personas.');
        } finally {
            setIsLoading(false);
        }
    }, [db]);


    useEffect(() => {
        fetchPersons(db);
    }, [fetchPersons, db]);

    return { persons, isLoading, error, fetchPersons };
};
