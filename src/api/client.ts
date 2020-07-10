import ky from 'ky';

interface IRequestConfig {
  url: string;
  data?: TObject;
}

export const apiClient = {
  async get<R>({ url, data }: IRequestConfig): Promise<R> {
    const result = await ky.get(url, { searchParams: data });
    return result.json();
  },
};
