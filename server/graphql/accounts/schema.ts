import { gql } from 'apollo-server-express';

export const schema = gql`
  type Account {
    _id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
    products: [Product]
  }

  extend type Query {
    testAccQ: Int
    getAccounts(name: String, email: String, page: Int, limit: Int): [Account]
  }

  input AccountInput {
    name: String
    email: String
  }

  extend type Mutation {
    testAccM: Boolean
    createAccount(account: AccountInput!): Account
  }
`;
