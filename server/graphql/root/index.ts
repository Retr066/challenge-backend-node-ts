import { gql } from 'apollo-server-express';

import {
  schema as accountsSchema,
  queries as accountsQueries,
  mutations as accountsMutations,
} from '../accounts';
import {
  schema as productsSchema,
  queries as productsQueries,
  mutations as productsMutations,
} from '../products';
import Products from '../../models/products';
import Accounts from '../../models/accounts';
import type { IAccount } from '../../interfaces/account';
import type { IProduct } from '../../interfaces/product';

const rootTypeDefs = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;

export const typeDefs = [rootTypeDefs, accountsSchema, productsSchema];

export const resolvers: any = {
  Query: {
    ...accountsQueries,
    ...productsQueries,
  },
  Mutation: {
    ...accountsMutations,
    ...productsMutations,
  },
  Account: {
    products: async (parent: IAccount) => {
      return await Products.find({ accountId: parent._id });
    },
  },
  Product: {
    account: async (parent: IProduct) => {
      return await Accounts.findById(parent.accountId);
    },
  },
};
