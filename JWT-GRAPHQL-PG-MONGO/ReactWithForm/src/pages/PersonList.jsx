import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useFetchPersons } from '../hooks/hooks crud/useFetchPersons';
import { PersonsTable } from '../components/CrudComponents/PersonsTable';
import { CreatePersonModal } from '../components/CrudComponents/CreatePersonModal';
import { UpdatePersonModal } from '../components/CrudComponents/UpdatePersonModal';
import { DeletePersonModal } from '../components/CrudComponents/DeletePersonModal';

export const PersonList = () => {
    const [selectedDb, setSelectedDb] = useState('mongo');
    const { persons, isLoading, error, fetchPersons } = useFetchPersons(selectedDb);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    const { logout, user } = useAuth();

    const handleEdit = (person) => {
        setSelectedPerson(person);
        setUpdateModalOpen(true);
    };

    const handleDelete = (person) => {
        setSelectedPerson(person);
        setDeleteModalOpen(true);
    };

    const handleCloseModals = () => {
        setCreateModalOpen(false);
        setUpdateModalOpen(false);
        setDeleteModalOpen(false);
        setSelectedPerson(null);
        fetchPersons(selectedDb);
    };

    return (
        <div>
            <h1>CRUD de Personas</h1>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <button onClick={() => setCreateModalOpen(true)} className="button-green">Crear registro</button>

                <select value={selectedDb} onChange={(e) => setSelectedDb(e.target.value)}>
                    <option value="mongo">MongoDB </option>
                    <option value="pg">Postgres</option>
                </select>

                {user && (user.nombre || user.apellidos) ? (
                    <div style={{ marginRight: 12 }}>
                        <strong>{`${user.nombre || ''} ${user.apellidos || ''}`.trim()}</strong>
                    </div>
                ) : user && user.email ? (
                    <div style={{ marginRight: 12 }}>
                        <strong>{user.email}</strong>
                    </div>
                ) : null}
                <button type="button" className="button-green" onClick={() => { logout(); }}>
                    Cerrar sesión
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <PersonsTable
                persons={persons}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

                {isCreateModalOpen && (
                <CreatePersonModal show={isCreateModalOpen} onClose={handleCloseModals} db={selectedDb} />
            )}

            {isUpdateModalOpen && selectedPerson && (
                <UpdatePersonModal show={isUpdateModalOpen} onClose={handleCloseModals} person={selectedPerson} db={selectedDb} />
            )}

            {isDeleteModalOpen && selectedPerson && (
                <DeletePersonModal show={isDeleteModalOpen} onClose={handleCloseModals} person={selectedPerson} db={selectedDb} />
            )}
        </div>
    );
};

export default PersonList;
