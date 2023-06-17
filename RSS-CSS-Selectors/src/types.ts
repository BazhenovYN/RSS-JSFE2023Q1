export type CallbackFn = (event: MouseEvent) => void;

export type ElementParams = {
  tag: string;
  classes: string[];
  id?: string;
  textContent?: string;
  callback?: CallbackFn;
};

type Attribute = Record<string, string>;

export type HtmlPattern = {
  tag: string;
  selected: boolean;
  pseudo: PseudoHtmlPattern;
  id?: string;
  classes?: string[];
  attributes?: Attribute;
  child?: HtmlPattern[];
};

type PseudoHtmlPattern = Pick<HtmlPattern, 'tag' | 'id' | 'classes' | 'attributes'>;

export type LevelData = {
  id: number;
  name: string;
  title: string;
  hint: string;
  examples: string[];
  selector: string;
  solution: string;
  htmlPattern: HtmlPattern[];
};

export type LevelDescription = Pick<LevelData, 'name' | 'title' | 'hint' | 'examples' | 'selector'>;

export type LevelStatus = Pick<LevelData, 'id' | 'selector'> & { completed: boolean };

export type GameProgress = {
  currentLevelNumber: number;
  totalLevels: number;
  currentLevelCompleted: boolean;
  score: LevelStatus[];
};

export type SaveSlot = {
  currentLevel: number;
  userSolution: string;
  complitedLevels: number[];
};
