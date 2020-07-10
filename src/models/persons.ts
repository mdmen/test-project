import { Address } from './address';

export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type PersonFull = Person & {
  address?: Address;
  description?: string;
};

export const baseFields = {
  id: 'id',
  firstName: 'Имя',
  lastName: 'Фамилия',
  email: 'E-mail',
  phone: 'Телефон',
};
