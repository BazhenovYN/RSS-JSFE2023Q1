export type Func<T1 = void, T2 = void> = (arg: T1) => T2;

interface MinimalDomElementProps<Tag extends keyof HTMLElementTagNameMap> {
  tag: Tag;
  style?: Partial<CSSStyleDeclaration>;
  children?: (DomElementProps | Node | string)[];
}

export type DomElementProps<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> =
  MinimalDomElementProps<Tag> & Partial<Omit<HTMLElementTagNameMap[Tag], keyof MinimalDomElementProps<Tag>>>;

export type Color = `#${string}`;

export interface ICarProps {
  name: string;
  color: Color;
}

export interface ICarResponse extends ICarProps {
  id: number;
}

export type CarStatus = 'started' | 'stopped' | 'broken';

export interface IWinnerProps {
  wins: number;
  time: number;
}

export interface IWinner extends IWinnerProps {
  id: number;
}

export type QueryParam = {
  key: string;
  value: string | number;
};

export type EmptyObject = Record<string, never>;

export type RaceParam = {
  velocity: number;
  distance: number;
};

export type RaceResult = {
  success: boolean;
};
