import { apiClient } from './client';
import { PersonFull } from '../models/persons';

type IPersonSource = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
  };
  description: string;
};

type IPersonsAPI = {
  load(params: { count?: number }): Promise<PersonFull[]>;
};

export const personsAPI: IPersonsAPI = {
  async load({ count = 1000 } = {}) {
    const host = 'http://www.filltext.com';
    const params = {
      id: '{number|1000}',
      firstName: '{firstName}',
      lastName: '{lastName}',
      email: '{email}',
      phone: '{phone|(xxx)xxx-xx-xx}',
      address: '{addressObject}',
      description: '{lorem|32}',
      delay: 1,
      rows: count,
    };

    const result = await apiClient.get<IPersonSource[]>({
      url: `${host}`,
      data: { ...params },
    });

    return result;
  },
};
