import mongoose from "mongoose";

import { mutations, queries } from "../../../graphql/products";
import { mutations as mutationAccount } from "../../../graphql/accounts";
import Accounts from "../../../models/accounts";
import Products from "../../../models/products";
import { mockAccount, mockProducts } from "../../../utils/mockups";
import { cnxAccounts, cnxProducts } from "../../../db/mongodb";

jest.spyOn(Products, 'aggregate').mockResolvedValue([mockProducts]);
jest.spyOn(Accounts, 'find').mockResolvedValue([mockAccount]);

beforeAll(async () => {
  jest.spyOn(console, 'info').mockImplementation(() => { });
  jest.spyOn(console, 'error').mockImplementation(() => { });
  jest.spyOn(mongoose, 'connect').mockResolvedValue({} as any);
  jest.spyOn(mongoose, 'disconnect').mockResolvedValue({} as any);


  await mutationAccount.createAccount(null, { account: mockAccount });
  await mutations.addProducts(null, { products: mockProducts });

  
});

afterAll(async () => {
  await Products.deleteMany({}); 
  await Accounts.deleteMany({}); 
  await cnxAccounts.close();
  await cnxProducts.close();
  jest.restoreAllMocks();
});


Products.aggregate = jest.fn().mockImplementation((pipeline: any[]) => {
  const matchStage = (pipeline as Array<{ $match?: Record<string, any> }>).find(stage => stage.$match)?.$match || {};
  const filteredProducts = mockProducts.filter(product => {
    let matches = true;
    if (matchStage.name) {
      matches = matches && new RegExp(matchStage.name.$regex, 'i').test(product.name);
    }
    if (matchStage.sku) {
      matches = matches && new RegExp(matchStage.sku.$regex, 'i').test(product.sku);
    }
    if (matchStage.accountId) {
      matches = matches && matchStage.accountId.$in.includes(product.accountId);
    }
    return matches;
  });

  if (Object.keys(matchStage).length === 0) {
    return mockProducts;
  }

  const skipStage = pipeline.find((stage: any) => stage.$skip)?.$skip || 0;
  const limitStage = pipeline.find((stage: any) => stage.$limit)?.$limit || filteredProducts.length;

  return filteredProducts.slice(skipStage, skipStage + limitStage);
});
jest.spyOn(Accounts, 'find').mockResolvedValue([mockAccount]);

  afterEach(() => {
    jest.restoreAllMocks(); 
  });


describe('getProducts', () => {

  it('debería obtener productos correctamente con filtros', async () => {
    const result = await queries.getProducts(null, {
      name: 'Producto 1',
      sku: 'SKU001',
      accountId: mockAccount._id,
      page: 1,
      limit: 10,
    });

    expect(result).toEqual([
      expect.objectContaining({
        _id: mockProducts[0]._id,
        name: mockProducts[0].name,
        sku: mockProducts[0].sku,
        accountId: mockProducts[0].accountId,
      }),
    ]);
    expect(Products.aggregate).toHaveBeenCalled();
    expect(Accounts.find).toHaveBeenCalledWith({ _id: mockAccount._id });
  });

  it('debería devolver productos sin filtros', async () => {
    const result = await queries.getProducts(null, {});

    const normalizedResult = result.map((item) => ({
      ...item,
      _id: item._id.toString(), // Convierte ObjectId a string
      accountId: item.accountId.toString(), // Convierte ObjectId a string
      createdAt: new Date(item.createdAt).toISOString(), // Normaliza la fecha
      updatedAt: new Date(item.updatedAt).toISOString(), // Normaliza la fecha
    }));

    expect(normalizedResult).toEqual(mockProducts);
  });

  it('debería lanzar un error si ocurre un problema al obtener productos', async () => {
    jest.spyOn(Products, 'aggregate').mockRejectedValue(new Error('Database error'));

    await expect(queries.getProducts(null, {})).rejects.toThrow(
      'Error al obtener productos: Database error',
    );
  });
});
