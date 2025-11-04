module.exports = `
  ### Tipos para modelos Postgres
  type Persona {
    _id: ID!
    dni: String!
    nombres: String!
    apellidos: String!
  }

  input CreatePersonaInput {
    dni: String!
    nombres: String!
    apellidos: String!
  }

  input UpdatePersonaInput {
    dni: String
    nombres: String
    apellidos: String
  }

  type User {
    _id: ID!
    nombre: String!
    apellidos: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  input CreateUserInput {
    nombre: String!
    apellidos: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    nombre: String
    apellidos: String
    email: String
    password: String
  }

  ### Queries
  type Query {
    # Paginación mediante limit y offset (opcional)
    getPersonas(limit: Int, offset: Int): [Persona!]!
    getPersona(id: ID!): Persona

    getUsers(limit: Int, offset: Int): [User!]!
    getUser(id: ID!): User

    me: User
  }

  ### Mutations
  type Mutation {
    createPersona(input: CreatePersonaInput!): Persona
    updatePersona(id: ID!, input: UpdatePersonaInput!): Persona
    deletePersona(id: ID!): Boolean

    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean

    register(nombre: String!, apellidos: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
  }
`;
