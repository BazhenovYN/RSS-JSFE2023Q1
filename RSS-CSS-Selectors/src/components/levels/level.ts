import { ElementParams, HtmlPattern, LevelData, LevelDescription } from 'types';
import ElementCreator from 'utils/element-creator';
import LEVEL_DATA from './data';

export default class Level {
  private level: LevelData;

  private levelView: DocumentFragment;

  public selectedElements: HTMLElement[];

  constructor(id: number) {
    this.level = LEVEL_DATA.find((elem) => elem.id === id) ?? LEVEL_DATA[0];
    this.selectedElements = [];
    this.levelView = document.createDocumentFragment();
    this.createVisualisation();
  }

  public getLevelId(): number {
    return this.level.id;
  }

  public getDescription(): LevelDescription {
    return {
      name: this.level?.name ?? '',
      title: this.level?.title ?? '',
      hint: this.level?.hint ?? '',
      examples: this.level?.examples ?? [],
      selector: this.level?.selector ?? '',
    };
  }

  public getSolution(): string {
    return this.level.solution;
  }

  public getLevelVisualisation(): DocumentFragment {
    return this.levelView;
  }

  private createElement(pattern: HtmlPattern): HTMLElement {
    const param: ElementParams = {
      tag: pattern.tag,
      classNames: pattern.classes ?? [],
    };
  
    const element = new ElementCreator(param);
  
    if (pattern.child) {
      pattern.child.forEach((childPattern) => {
        element.addInnerElement(this.createElement(childPattern));
      });
    }
  
    if (pattern.selected) {
      this.selectedElements.push(element.getElement());
    }
  
    return element.getElement();
  }

  private createVisualisation(): void {
    this.level.htmlPattern.forEach((pattern) => {
      const element: HTMLElement = this.createElement(pattern);
      this.levelView.append(element);
    });
  }
}
