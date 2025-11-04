import { graphqlRequest } from './graphqlClient';

const REGISTER_MUTATION = `mutation Register($nombre:String!,$apellidos:String!,$email:String!,$password:String!){
  register(nombre:$nombre,apellidos:$apellidos,email:$email,password:$password)
}`;

const LOGIN_MUTATION = `mutation Login($email:String!,$password:String!){
  login(email:$email,password:$password)
}`;

export const register = async ({ nombre, apellidos, email, password }) => {
  const data = await graphqlRequest(REGISTER_MUTATION, { nombre, apellidos, email, password });
  return data.register; 
};

export const login = async ({ email, password }) => {
  const data = await graphqlRequest(LOGIN_MUTATION, { email, password });
  return data.login; // token string
};

export default { register, login };
