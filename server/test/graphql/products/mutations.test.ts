import mongoose from "mongoose";

import { mutations } from "../../../graphql/products";
import {mutations as mutationAccount} from "../../../graphql/accounts";
import { IProduct } from '../../../interfaces/product';
import Products from "../../../models/products";
import { mockAccount, mockProducts } from "../../../utils/mockups";
import { cnxAccounts, cnxProducts } from "../../../db/mongodb";
import Accounts from "../../../models/accounts";

jest.spyOn(Products, 'insertMany').mockImplementation(async function (this: typeof Products, products: unknown) {
    return products as any; 
});

beforeAll(async () => {
  jest.spyOn(console, 'info').mockImplementation(() => {}); 
  jest.spyOn(console, 'error').mockImplementation(() => {}); 
  jest.spyOn(mongoose, 'connect').mockResolvedValue({} as any); 
  jest.spyOn(mongoose, 'disconnect').mockResolvedValue({} as any); 

  await mutationAccount.createAccount(null, { account: mockAccount });
  
});

afterAll(async () => {
  
  await Products.deleteMany({}); 
  await Accounts.deleteMany({}); 
  await cnxAccounts.close();
  await cnxProducts.close();
  jest.restoreAllMocks(); 
});




describe('addProducts', () => {
  it('debería agregar productos correctamente', async () => {
    const result = await mutations.addProducts(null, { products: mockProducts });

    expect(result).toEqual(mockProducts);
    expect(Products.insertMany).toHaveBeenCalledWith(mockProducts);
  });

  it('debería lanzar un error si la validación falla', async () => {
    const invalidProducts = [
      { name: '', sku: '', accountId: '' }, 
    ];

    await expect(
      mutations.addProducts(null, { products: invalidProducts }),
    ).rejects.toThrow(
      'Error al crear el producto: El producto "sin nombre" tiene campos obligatorios faltantes. | El accountId "" no es válido.',
    );
  });
});
