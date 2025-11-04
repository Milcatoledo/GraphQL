module.exports = `
  ### Tipos para modelos (Mongo y Postgres)
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
    getPersonas(limit: Int, offset: Int, db: String): [Persona!]!
    getPersona(id: ID!, db: String): Persona

    getUsers(limit: Int, offset: Int): [User!]!
    getUser(id: ID!): User

    me: User
  }

  ### Mutations
  type Mutation {
    createPersona(input: CreatePersonaInput!, db: String): Persona
    updatePersona(id: ID!, input: UpdatePersonaInput!, db: String): Persona
    deletePersona(id: ID!, db: String): Boolean

    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean

    register(nombre: String!, apellidos: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
  }
`;
