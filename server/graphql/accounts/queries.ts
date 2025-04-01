import Accounts from '../../models/accounts';
import logger from '../../utils/logger';
import {
  validateAccountQuery,
  validatePagination,
} from '../../utils/validation';

export const queries = {
  testAccQ: async (_: any) => {
    const accounts = await Accounts.find({});
    return accounts.length;
  },
  getAccounts: async (
    _: any,
    {
      name,
      email,
      page = 1,
      limit = 10,
    }: { name?: string; email?: string; page?: number; limit?: number },
  ) => {
   try {

    validatePagination(page, limit);
    validateAccountQuery({ name, email });
    
    const match: any = {};
    if (name) {
      match.name = { $regex: name, $options: 'i' };
    }
    if (email) {
      match.email = { $regex: email, $options: 'i' };
    }

    const accounts = await Accounts.aggregate([
      { $match: match },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return accounts;
   } catch (error: unknown) {
    logger.error(
      `Error al obtener las cuentas: ${
        error instanceof Error ? error.message : 'Error desconocido'
      } :: ${JSON.stringify(error)}`,
    );
    throw new Error('Error al obtener las cuentas: ' + error);
   }
  },
};
