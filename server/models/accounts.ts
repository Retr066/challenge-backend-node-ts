import { Schema } from 'mongoose';

import type { IAccount } from '../interfaces/account';
import { cnxAccounts } from '../db/mongodb';

const accountsSchema = new Schema<IAccount>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true , versionKey: false },
);

const Accounts = cnxAccounts.model<IAccount>('Accounts', accountsSchema);

export default Accounts;
