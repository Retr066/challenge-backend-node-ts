import { gql } from 'apollo-server-express';

export const schema = gql`
  type Product {
    _id: ID!
    name: String!
    sku: String!
    account: Account!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    testProdQ: Int
    getProducts(
      name: String
      sku: String
      accountId: String
      page: Int
      limit: Int
    ): [Product]
  }

  input ProductInput {
    name: String!
    sku: String!
    accountId: ID!
  }

  extend type Mutation {
    testProdM: Boolean
    addProducts(products: [ProductInput]!): [Product]
  }
`;
