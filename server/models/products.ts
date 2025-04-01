import { Schema } from 'mongoose';

import type { IProduct } from '../interfaces/product';
import { cnxProducts } from '../db/mongodb';

const productsSchema = new Schema<IProduct>(
  {
    name: { type: String },
    sku: { type: String },
    accountId: { type: Schema.Types.ObjectId, ref: 'Accounts', required: true },
  },
  { timestamps: true, versionKey: false },
);

const Products = cnxProducts.model<IProduct>('Products', productsSchema);

export default Products;
