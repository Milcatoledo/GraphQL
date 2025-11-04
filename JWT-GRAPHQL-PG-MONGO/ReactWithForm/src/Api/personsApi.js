import * as personsGql from './personsGql';

export const getPersons = async (db = 'mongo', options = {}) => {
  if (db && typeof db === 'object') {
    const { limit, offset } = db;
    return await personsGql.getPersons({ limit, offset, db: 'mongo' });
  }
  return await personsGql.getPersons({ ...options, db });
};

export const createPerson = async (personData, db = 'mongo') => {
  return await personsGql.createPerson(personData, db);
};

export const updatePerson = async (id, personData, db = 'mongo') => {
  return await personsGql.updatePerson(id, personData, db);
};

export const deletePerson = async (id, db = 'mongo') => {
  return await personsGql.deletePerson(id, db);
};


export default { getPersons, createPerson, updatePerson, deletePerson };
