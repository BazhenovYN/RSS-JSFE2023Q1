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

export interface IResponseError {
  status: string,
  code: string,
  message: string,
}

export type IResponse = IResponseSources | IResponseNews | IResponseError;

export type Options = Record<string, string>;

export interface IDrawSourcesFunc {
  (data: IResponseSources): void;
}

export interface IDrawNewsFunc {
  (data: IResponseNews): void;
}
