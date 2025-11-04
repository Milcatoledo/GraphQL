import { graphqlRequest } from './graphqlClient';

const GET_PERSONS_QUERY = `query GetPersonas($limit:Int,$offset:Int){
  getPersonas(limit:$limit,offset:$offset){ _id dni nombres apellidos }
}`;

const CREATE_PERSON_MUTATION = `mutation CreatePersona($input:CreatePersonaInput!){
  createPersona(input:$input){ _id dni nombres apellidos }
}`;

const UPDATE_PERSON_MUTATION = `mutation UpdatePersona($id:ID!,$input:UpdatePersonaInput!){
  updatePersona(id:$id,input:$input){ _id dni nombres apellidos }
}`;

const DELETE_PERSON_MUTATION = `mutation DeletePersona($id:ID!){
  deletePersona(id:$id)
}`;

export const getPersons = async ({ limit, offset } = {}) => {
  const data = await graphqlRequest(GET_PERSONS_QUERY, { limit, offset });
  return data.getPersonas;
};

export const createPerson = async (input) => {
  const data = await graphqlRequest(CREATE_PERSON_MUTATION, { input });
  return data.createPersona;
};

export const updatePerson = async (id, input) => {
  const data = await graphqlRequest(UPDATE_PERSON_MUTATION, { id, input });
  return data.updatePersona;
};

export const deletePerson = async (id) => {
  const data = await graphqlRequest(DELETE_PERSON_MUTATION, { id });
  return data.deletePersona;
};

export default { getPersons, createPerson, updatePerson, deletePerson };