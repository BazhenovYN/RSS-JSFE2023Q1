export type CallbackFn = (event: MouseEvent) => void;

export type ElementParams = {
  tag: string;
  classes?: string[];
  id?: string;
  textContent?: string;
  attributes?: Attribute;
  callback?: CallbackFn;
};

export type Attribute = Record<string, string>;

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
  task: string,
  name: string;
  title: string;
  hint: string;
  example: string;
  selector: string;
  solution: string;
  htmlPattern: HtmlPattern[];
};

export type LevelDescription = Pick<LevelData, 'name' | 'title' | 'hint' | 'example' | 'selector'>;

export type LevelStatus = Pick<LevelData, 'id' | 'selector'> & { 
  completed: boolean;
  hint: boolean; 
};

export type GameProgress = {
  currentLevelNumber: number;
  totalLevels: number;
  currentLevelCompleted: boolean;
  hint: boolean,
  score: LevelStatus[];
};

export type SaveSlot = {
  currentLevelNumber: number;
  userSelector: string;
  score: LevelStatus[];
};
