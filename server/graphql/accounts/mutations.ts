import type { IAccount } from '../../interfaces/account';
import Accounts from '../../models/accounts';
import logger from '../../utils/logger';
import { validateAccount } from '../../utils/validation';

export const mutations = {
  testAccM: async (_: any) => {
    return true;
  },
  createAccount: async (_: any, { account }: { account: IAccount }) => {
    try {
      validateAccount(account);
      const newAccount = new Accounts(account);
      await newAccount.save();
      return newAccount;
    } catch (error: any) {
      logger.error(
        `Error al crear la cuenta: ${error?.message} :: ${JSON.stringify(
          error,
        )}`,
      );
      throw new Error('Error al crear la cuenta: ' + error?.message);
     
    }
  },
};
