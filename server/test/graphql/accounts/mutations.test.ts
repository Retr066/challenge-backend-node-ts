import mongoose from "mongoose";

import { mutations } from "../../../graphql/accounts";
import Accounts from "../../../models/accounts";
import { mockAccount } from "../../../utils/mockups";
import { cnxAccounts, cnxProducts } from "../../../db/mongodb";


jest.spyOn(Accounts.prototype, 'save').mockImplementation(async function (this: typeof Accounts) {
  return this;
});

beforeAll(async () => {
  jest.spyOn(console, 'info').mockImplementation(() => { });
  jest.spyOn(console, 'error').mockImplementation(() => { });
  jest.spyOn(mongoose, 'connect').mockResolvedValue({} as any);
  jest.spyOn(mongoose, 'disconnect').mockResolvedValue({} as any);
});

afterAll(async () => {
  await cnxAccounts.close();
  await cnxProducts.close();
  jest.restoreAllMocks();
});



describe('createAccount', () => {
  it('debería crear una cuenta correctamente', async () => {
    const result = await mutations.createAccount(null, { account: mockAccount });

    // Verifica solo las propiedades relevantes
    expect(result.name).toEqual(mockAccount.name);
    expect(result.email).toEqual(mockAccount.email);
    expect(Accounts.prototype.save).toHaveBeenCalled();
  });

  it('debería lanzar un error si la validación falla', async () => {
    const invalidAccount = { name: '', email: '' };

    await expect(
      mutations.createAccount(null, { account: invalidAccount }),
    ).rejects.toThrow("El campo 'name' es obligatorio.");
  });
});
