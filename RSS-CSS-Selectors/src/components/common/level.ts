import { HtmlPattern, LevelData, LevelDescription } from 'types';
import { getHtmlString } from 'utils/utils';
import ElementCreator from 'utils/element-creator';
import LEVEL_DATA from 'data/data';
import HtmlLine from 'components/html-editor/html-line';

const START_LEVEL = 1;

export default class Level {
  private level: LevelData;

  private levelView: DocumentFragment;

  private htmlLevelView: DocumentFragment;

  private goal: HTMLElement[] = [];

  private selectedElements: ElementCreator[] = [];

  private selectedHtmlElements: HtmlLine[] = [];

  constructor(id = START_LEVEL) {
    this.level = LEVEL_DATA.find((elem) => elem.id === id) ?? LEVEL_DATA[0];
    this.levelView = document.createDocumentFragment();
    this.htmlLevelView = document.createDocumentFragment();
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
      example: this.level?.example ?? '',
      selector: this.level?.selector ?? '',
    };
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
      element.setCssClasses(['selected']);
      this.selectedElements.forEach((item) => item.removeCssClasses(['selected']));
      this.selectedElements.push(element);

      htmlElement.setCssClasses(['selected']);
      this.selectedHtmlElements.forEach((item) => item.removeCssClasses(['selected']));
      this.selectedHtmlElements.push(htmlElement);
    };

    const handleMouseLeave = (): void => {
      this.selectedElements.pop()?.removeCssClasses(['selected']);
      this.selectedElements.slice(-1)[0]?.setCssClasses(['selected']);

      this.selectedHtmlElements.pop()?.removeCssClasses(['selected']);
      this.selectedHtmlElements.slice(-1)[0]?.setCssClasses(['selected']);
    };

    element.setMouseEnterEventListener(handleMouseEnter);
    element.setMouseLeaveEventListener(handleMouseLeave);
    htmlElement.setMouseEnterEventListener(handleMouseEnter);
    htmlElement.setMouseLeaveEventListener(handleMouseLeave);
  }

  private createElement(pattern: HtmlPattern): HTMLElement[] {
    const element = new ElementCreator({
      tag: pattern.tag,
      classes: pattern.classes ?? [],
    });

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
      this.goal.push(element.getElement());
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
}
