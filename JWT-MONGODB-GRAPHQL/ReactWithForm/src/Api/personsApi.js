import * as personsGql from './personsGql';

export const getPersons = async (db = 'mongodb') => {
  if (db && typeof db === 'object') {
    const { limit, offset } = db;
    return await personsGql.getPersons({ limit, offset });
  }
  return await personsGql.getPersons();
};

export const createPerson = async (personData) => {
  return await personsGql.createPerson(personData);
};

export const updatePerson = async (id, personData) => {
  return await personsGql.updatePerson(id, personData);
};

export const deletePerson = async (id, db) => {
  void db;
  return await personsGql.deletePerson(id);
};


export default { getPersons, createPerson, updatePerson, deletePerson };