import type { ObjectId } from 'mongoose';

export interface IProduct {
  _id?: string;
  name: string;
  sku: string;
  accountId: ObjectId | string;
  createdAt?: string;
  updatedAt?: string;
}
