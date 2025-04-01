import { isValidObjectId, ObjectId } from 'mongoose';

import type { IAccount } from '../interfaces/account';
import type { IProduct } from '../interfaces/product';

export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

export const validateProducts = (products: IProduct[]): void => {
  const errors: string[] = [];

  for (const product of products) {
    if (!product.name || !product.sku || !product.accountId) {
      errors.push(
        `El producto "${product.name || 'sin nombre'}" tiene campos obligatorios faltantes.`,
      );
    }
    if (!isValidObjectId(product.accountId)) {
      errors.push(`El accountId "${product.accountId}" no es válido.`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' | ')); // Muestra todos los errores en una sola excepción
  }
};

export const validateAccount = (account: IAccount): void => {
    if (!account.name) {
      throw new Error("El campo 'name' es obligatorio.");
    }
    if (!account.email) {
      throw new Error("El campo 'email' es obligatorio.");
    }
    if (!isValidEmail(account.email)) {
      throw new Error('El correo no tiene un formato válido.');
    }
  };


export const validatePagination = (page?: number, limit?: number) => {
  if (page !== undefined && (typeof page !== 'number' || page < 1)) {
    throw new Error('El número de página debe ser un número mayor a 0.');
  }
  if (limit !== undefined && (typeof limit !== 'number' || limit < 1)) {
    throw new Error('El límite debe ser un número mayor a 0.');
  }
};

export const validateProductQuery = ({
  name,
  sku,
  accountId,
}: {
  name?: string;
  sku?: string;
  accountId?: string;
}) => {
  if (name && typeof name !== 'string') {
    throw new Error('El nombre del producto debe ser un string.');
  }
  if (sku && typeof sku !== 'string') {
    throw new Error('El SKU del producto debe ser un string.');
  }
  if (accountId && !isValidObjectId(accountId)) {
    throw new Error(`El accountId "${accountId}" no es válido.`);
  }
};

export const validateAccountQuery = ({
  name,
  email,
}: {
  name?: string;
  email?: string;
}) => {
  if (name && typeof name !== 'string') {
    throw new Error('El nombre de la cuenta debe ser un string.');
  }
  if (email && (typeof email !== 'string' || !isValidEmail(email))) {
    throw new Error('El email de la cuenta no tiene un formato válido.');
  }
};
