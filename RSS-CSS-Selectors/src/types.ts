export type CallbackFn = (event: MouseEvent) => void;

export type ElementParams = {
  tag: string;
  classNames: string[];
  textContent?: string;
  callback?: CallbackFn;
};

type HtmpPattern = {
  tag: string;
  pseudoTag: string;
  id?: string;
  class?: string[];
  child?: HtmpPattern[];
};

export type LevelData = {
  id: number;
  name: string;
  title: string;
  hint: string;
  examples: string[];
  selector: string;
  solution: string;
  htmlPattern: HtmpPattern[];
};

export type LevelDescription = Pick<LevelData, 'name' | 'title' | 'hint' | 'examples' | 'selector'>;

export type SaveSlot = {
  currentLevel: number;
  userSolution: string;
  complitedLevels: number[];
};
