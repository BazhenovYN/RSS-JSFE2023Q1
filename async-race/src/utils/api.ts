import { baseUrl } from 'app/consts';
import { EmptyObject, QueryParam } from 'types';

const generateQueryString = (queryParams: QueryParam[]): string =>
  queryParams.length ? `?${queryParams.map((param) => `${param.key}=${param.value}`).join('&')}` : '';

export const get = async <T>(path: string, queryParams: QueryParam[] = []): Promise<T> => {
  const query = generateQueryString(queryParams);
  const response = await fetch(`${baseUrl}${path}${query}`);
  return response.json();
};

export const post = async <T, K>(path: string, body: K): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

export const del = async (path: string): Promise<EmptyObject> => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
  });
  return response.json();
};

export const put = async <T, K>(path: string, body: K): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

export const patch = async <T>(path: string, queryParams: QueryParam[] = []): Promise<T> => {
  const query = generateQueryString(queryParams);
  const response = await fetch(`${baseUrl}${path}${query}`, {
    method: 'PATCH',
  });
  return response.json();
};
