import { ObjectId } from 'mongodb';

import { IProduct } from '../interfaces/product';
import { IAccount } from '../interfaces/account';

export const mockAccount = {
  _id: '67eb3fd72f773bb132b81e0f',
  name: 'Juan Perez',
  email: 'juan.perez@example.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockProducts = [
  {
    _id: '67eb35ab105fd1676495b9d4',
    name: 'Producto 1',
    sku: 'SKU001',
    accountId: '67eb3fd72f773bb132b81e0f',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '67eb35ab105fd1676495b9d5',
    name: 'Producto 2',
    sku: 'SKU002',
    accountId: '67eb3fd72f773bb132b81e0f',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]


