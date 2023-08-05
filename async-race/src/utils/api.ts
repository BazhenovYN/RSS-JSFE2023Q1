import { baseUrl, emptyString } from 'app/consts';
import type { EmptyObject, QueryParam } from 'types';

const generateQueryString = (queryParams: QueryParam[]): string => {
  if (!queryParams.length) {
    return emptyString;
  }
  const params = queryParams.reduce((acc, curr) => {
    acc.append(curr.key, String(curr.value));
    return acc;
  }, new URLSearchParams());
  return `?${params.toString()}`;
}

export const get = async <T>(path: string, queryParams: QueryParam[] = []): Promise<{data: T; totalCount: number | null}> => {
  const query = generateQueryString(queryParams);
  const response = await fetch(`${baseUrl}${path}${query}`);
  const data = await response.json() as T;
  const totalCount = response.headers.get('X-Total-Count');
  return { data, totalCount: totalCount ? Number(totalCount) : null };
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
