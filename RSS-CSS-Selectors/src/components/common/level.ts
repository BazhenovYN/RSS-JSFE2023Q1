import LEVEL_DATA from 'data/data';
import HtmlLine from 'components/html-editor/html-line';
import ElementCreator from 'utils/element-creator';
import { getHtmlString } from 'utils/utils';
import type { HtmlPattern, LevelData, LevelDescription } from 'types';

const START_LEVEL = 1;

export default class Level {
  private level: LevelData;

  private levelView: DocumentFragment;

  private htmlLevelView: DocumentFragment;

  private answer: HTMLElement[] = [];

  private hoveredElements: ElementCreator[] = [];

  private hoveredMarkupElements: HtmlLine[] = [];

  constructor(id = START_LEVEL) {
    this.level = LEVEL_DATA.find((elem) => elem.id === id) ?? LEVEL_DATA[0];
    this.levelView = document.createDocumentFragment();
    this.htmlLevelView = document.createDocumentFragment();
    this.createVisualisation();
  }

  public getTaskLevel(): string {
    return `#${this.level.id} ${this.level.task}`;
  }

  public getLevelId(): number {
    return this.level.id;
  }

  public getDescription(): LevelDescription {
    const { name, title, hint, example, selector } = this.level; 
    return { name, title, hint, example, selector, };
  }

  public getSolution(): string {
    return this.level.solution;
  }

  public getLevelVisualisation(): DocumentFragment {
    return this.levelView;
  }

  public getHtmlLevelVisualisation(): DocumentFragment {
    return this.htmlLevelView;
  }

  private createMouseHandlers(element: ElementCreator, htmlElement: HtmlLine): void {
    const handleMouseEnter = (): void => {
      element.setCssClasses(['hover']);
      this.hoveredElements.forEach((item) => item.removeCssClasses(['hover']));
      this.hoveredElements.push(element);

      htmlElement.setCssClasses(['hover']);
      this.hoveredMarkupElements.forEach((item) => item.removeCssClasses(['hover']));
      this.hoveredMarkupElements.push(htmlElement);
    };

    const handleMouseLeave = (): void => {
      this.hoveredElements.pop()?.removeCssClasses(['hover']);
      this.hoveredElements.slice(-1)[0]?.setCssClasses(['hover']);

      this.hoveredMarkupElements.pop()?.removeCssClasses(['hover']);
      this.hoveredMarkupElements.slice(-1)[0]?.setCssClasses(['hover']);
    };

    element.setMouseEnterEventListener(handleMouseEnter);
    element.setMouseLeaveEventListener(handleMouseLeave);
    htmlElement.setMouseEnterEventListener(handleMouseEnter);
    htmlElement.setMouseLeaveEventListener(handleMouseLeave);
  }

  private createElement(pattern: HtmlPattern): HTMLElement[] {
    const element = new ElementCreator({
      tag: pattern.tag,
      id: pattern.id,
      classes: pattern.classes ?? [],
    });

    if(pattern.selected) {
      element.setCssClasses(['bounce']);
    }

    const htmlElement = new HtmlLine(pattern);

    const tooltip = new ElementCreator({
      tag: 'span',
      classes: ['tooltiptext'],
      textContent: getHtmlString(pattern, false),
    });

    element.addInnerElement(tooltip);

    if (pattern.child) {
      pattern.child.forEach((childPattern) => {
        const [innerElement, innerHtmlElement] = this.createElement(childPattern);
        element.addInnerElement(innerElement);
        htmlElement.addInnerElement(innerHtmlElement);
        htmlElement.addClosingTag(pattern);
      });
    }

    if (pattern.selected) {
      this.answer.push(element.getElement());
    }

    this.createMouseHandlers(element, htmlElement);

    return [element.getElement(), htmlElement.getElement()];
  }

  private createVisualisation(): void {
    // parallel creation of elements for visualization and html editor
    this.level.htmlPattern.forEach((pattern) => {
      const [element, htmlElement] = this.createElement(pattern);
      this.levelView.append(element);
      this.htmlLevelView.append(htmlElement);
    });
  }

  public getAnswer(): HTMLElement[] {
    return this.answer;
  }
}
