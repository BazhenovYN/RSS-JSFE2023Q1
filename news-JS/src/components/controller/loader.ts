import { HttpMethod, Endpoint, Options, ErrorCodes, CallbackFn } from '../../types';

const noCallback = (): void => {
  throw Error('No callback for GET response');
};

class Loader {
  constructor(private baseLink: string, private options: Options) {
    this.baseLink = baseLink;
    this.options = options;
  }

  public getResp<T>(
    endpoint: Endpoint,
    callback: CallbackFn<T> = noCallback,
    options: Options = {},
  ): void {
    this.load<T>(HttpMethod.GET, endpoint, options, callback);
  }

  private makeUrl(options: Options, endpoint: Endpoint): string {
    const urlOptions = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}?`;

    Object.keys(urlOptions).forEach((key) => {
      url += `${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  private load<T>(
    method: HttpMethod,
    endpoint: Endpoint,
    options: Options,
    callback: CallbackFn<T>,
  ): void {
    fetch(this.makeUrl(options, endpoint), { method })
      .then((response: Response) => {
        if (!response.ok) {
          if (response.status === ErrorCodes.ERROR401 || response.status === ErrorCodes.ERROR404) {
            throw Error(`${response.status} error: ${response.statusText}`);
          }
        }
        return response.json();
      })
      .then(callback)
      .catch((error: Error) => {
        throw error;
      });
  }
}

export default Loader;
