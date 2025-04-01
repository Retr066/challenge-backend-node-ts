import mongoose from "mongoose";

import { queries } from "../../../graphql/accounts";
import Accounts from "../../../models/accounts";
import { mockAccount } from "../../../utils/mockups";
import { cnxAccounts, cnxProducts } from "../../../db/mongodb";

jest.spyOn(Accounts, 'find').mockResolvedValue([mockAccount]);

beforeAll(async () => {
  jest.spyOn(console, 'info').mockImplementation(() => {}); 
  jest.spyOn(console, 'error').mockImplementation(() => {}); 
});

afterEach(() => {
  jest.restoreAllMocks(); 
});

afterAll(async () => {
  // Cierra ambas conexiones
  await cnxAccounts.close();
  await cnxProducts.close();
  jest.restoreAllMocks(); 
});


describe('getAccounts', () => {
 

  it('debería obtener cuentas correctamente', async () => {
    jest.spyOn(Accounts, 'aggregate').mockResolvedValue([{
      ...mockAccount,
      createdAt: new Date(mockAccount.createdAt), 
      updatedAt: new Date(mockAccount.updatedAt), 
    }]);

    const result = await queries.getAccounts(null, {});

    // Normaliza las fechas en el resultado
    const normalizedResult = result.map(account => ({
      ...account,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }));

    
    expect(normalizedResult).toEqual([
      expect.objectContaining({
        _id: mockAccount._id,
        name: mockAccount.name,
        email: mockAccount.email,
        createdAt: mockAccount.createdAt,
        updatedAt: mockAccount.updatedAt,
      }),
    ]);
    expect(Accounts.aggregate).toHaveBeenCalled();
  });

  it('debería lanzar un error si ocurre un problema al obtener cuentas', async () => {
    jest.spyOn(Accounts, 'aggregate').mockRejectedValue(new Error('Database error'));

    await expect(queries.getAccounts(null, {})).rejects.toThrow(
      'Error al obtener las cuentas: Error: Database error',
    );
  });
});
