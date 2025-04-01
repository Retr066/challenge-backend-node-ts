import Products from '../../models/products';
import Accounts from '../../models/accounts';
import type { IAccount } from '../../interfaces/account';
import {
  validatePagination,
  validateProductQuery,
} from '../../utils/validation';
import logger from '../../utils/logger';

export const queries = {
  testProdQ: async (_: any) => {
    const products = await Products.find({});
    return products.length;
  },
  getProducts: async (
    _: any,
    {
      name,
      sku,
      accountId,
      page = 1,
      limit = 10,
    }: {
      name?: string;
      sku?: string;
      accountId?: string;
      page?: number;
      limit?: number;
    },
  ) => {
    try {
      validatePagination(page, limit);
      validateProductQuery({ name, sku, accountId });

      let accounts: IAccount[] = [];

      if (accountId) {
        accounts = await Accounts.find({ _id: accountId });
      }

      const accountIds = accounts.map((account) => account._id);
      const match: any = {};
      if (name) { match.name = { $regex: new RegExp(name, 'i') }; }
      if (sku) { match.sku = { $regex: new RegExp(sku, 'i') }; }
      if (accountIds.length > 0) { match.accountId = { $in: accountIds }; }


      const products = await Products.aggregate([
        { $match: match },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]);

      return products;
    } catch (error: any) {
      logger.error(
        `Error al obtener los productos: ${error?.message} :: ${JSON.stringify(
          error,
        )}`,
      );
      throw new Error('Error al obtener productos: ' + error.message);
    }
  },
};
