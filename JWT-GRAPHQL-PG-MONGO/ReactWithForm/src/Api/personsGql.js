import { graphqlRequest } from './graphqlClient';

const GET_PERSONS_QUERY = `query GetPersonas($limit:Int,$offset:Int,$db:String){
  getPersonas(limit:$limit,offset:$offset,db:$db){ _id dni nombres apellidos }
}`;

const CREATE_PERSON_MUTATION = `mutation CreatePersona($input:CreatePersonaInput!,$db:String){
  createPersona(input:$input,db:$db){ _id dni nombres apellidos }
}`;

const UPDATE_PERSON_MUTATION = `mutation UpdatePersona($id:ID!,$input:UpdatePersonaInput!,$db:String){
  updatePersona(id:$id,input:$input,db:$db){ _id dni nombres apellidos }
}`;

const DELETE_PERSON_MUTATION = `mutation DeletePersona($id:ID!,$db:String){
  deletePersona(id:$id,db:$db)
}`;

export const getPersons = async ({ limit, offset, db } = {}) => {
  const data = await graphqlRequest(GET_PERSONS_QUERY, { limit, offset, db });
  return data.getPersonas;
};

export const createPerson = async (input, db) => {
  const data = await graphqlRequest(CREATE_PERSON_MUTATION, { input, db });
  return data.createPersona;
};

export const updatePerson = async (id, input, db) => {
  const data = await graphqlRequest(UPDATE_PERSON_MUTATION, { id, input, db });
  return data.updatePersona;
};

export const deletePerson = async (id, db) => {
  const data = await graphqlRequest(DELETE_PERSON_MUTATION, { id, db });
  return data.deletePersona;
};

export default { getPersons, createPerson, updatePerson, deletePerson };
