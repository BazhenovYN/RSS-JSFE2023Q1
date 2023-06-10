export interface ISource {
  name: string,
  id: string
}

export interface IArticle {
  urlToImage: string,
  author: string,
  source : ISource,
  publishedAt: string,
  title: string,
  description: string,
  url: string,
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

export enum APIEndpoint {
  Sources = 'sources',
  Everything = 'everything',
}

export enum ErrorCodes {
  ERROR401 = 401,
  ERROR404 = 404,
}

export type Endpoint = APIEndpoint | string;

export enum ResponseStatus {
  Oк = 'ok',
  Error = 'error',
}

export interface IResponseSources {
  status: string,
  sources: ISource[],
}

export interface IResponseNews {
  status: string,
  totalResults: number,
  articles: IArticle[],
}

export type Options = Record<string, string>;

export type CallbackFn<T> = (data: T) => void;
