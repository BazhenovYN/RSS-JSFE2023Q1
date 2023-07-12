interface MinimalDomElementProps<Tag extends keyof HTMLElementTagNameMap> {
  tag: Tag;
  style?: CSSStyleDeclaration;
  children?: (DomElementProps | Node | string)[];
}

export type DomElementProps<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> =
  MinimalDomElementProps<Tag> & Partial<Omit<HTMLElementTagNameMap[Tag], keyof MinimalDomElementProps<Tag>>>;

export interface CarProps {
  name: string;
  color: string;
}

export interface Car extends CarProps {
  id: number;
}
export interface WinnerProps {
  wins: number;
  time: number;
}

export interface Winner extends WinnerProps {
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
