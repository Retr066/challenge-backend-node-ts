import { isValidObjectId, ObjectId } from 'mongoose';

import type { IProduct } from '../../interfaces/product';
import Accounts from '../../models/accounts';
import Products from '../../models/products';
import { validateProducts } from '../../utils/validation';

export const mutations = {
  testProdM: async (_: any) => {
    return true;
  },
  addProducts: async (_: any, { products }: { products: IProduct[] }) => {
    try {
      if (!Array.isArray(products) || products.length === 0) {
        throw new Error(
          'El campo products es obligatorio y debe ser un array.',
        );
      }
      validateProducts(products);

      const accountIds = [
        ...new Set(products.map((product) => product.accountId)),
      ];
      const accounts = await Accounts.find({ _id: { $in: accountIds } });

      const validAccountIds = accounts.map((account) => account._id.toString());
      const invalidAccountIds = accountIds.filter(
        (id) => !validAccountIds.includes(id.toString()),
      );

      if (invalidAccountIds.length > 0) {
        throw new Error(
          `Los siguientes accountIds no son válidos: ${invalidAccountIds.join(', ')}`,
        );
      }

      const newProducts = await Products.insertMany(products);

      return newProducts;
    } catch (error: any) {
      throw new Error('Error al crear el producto: ' + error?.message);
    }
  },
};
