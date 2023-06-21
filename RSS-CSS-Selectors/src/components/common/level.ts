import { HtmlPattern, LevelData, LevelDescription } from 'types';
import ElementCreator from 'utils/element-creator';
import LEVEL_DATA from 'data/data';
import HtmlLine from 'components/html-editor/html-line';

const START_LEVEL = 1;

export default class Level {
  private level: LevelData;

  private levelView: DocumentFragment;

  private htmlLevelView: DocumentFragment;

  private selectedElements: HTMLElement[] = [];

  private tooltipElements: ElementCreator[] = [];

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

  private createTooltip(element: ElementCreator, pattern: HtmlPattern): ElementCreator {
    const tooltip = new ElementCreator({
      tag: 'span',
      classes: ['tooltiptext'],
      textContent: pattern.pseudo.tag,
    });

    const handleMouseEnter = (): void => {
      element.setCssClasses(['tooltip']);
      this.tooltipElements.forEach((item) => item.removeCssClasses(['tooltip']));
      this.tooltipElements.push(element);
    };

    const handleMouseLeave = (): void => {
      this.tooltipElements.pop()?.removeCssClasses(['tooltip']);
      this.tooltipElements.slice(-1)[0]?.setCssClasses(['tooltip']);
    };

    element.setMouseEnterEventListener(handleMouseEnter);
    element.setMouseLeaveEventListener(handleMouseLeave);

    return tooltip;
  }

  private createElement(pattern: HtmlPattern): HTMLElement[] {
    const element = new ElementCreator({
      tag: pattern.tag,
      classes: pattern.classes ?? [],
    });

    element.addInnerElement(this.createTooltip(element, pattern));

    const htmlElement = new HtmlLine(pattern);

    if (pattern.child) {
      pattern.child.forEach((childPattern) => {
        const [innerElement, innerHtmlElement] = this.createElement(childPattern);
        element.addInnerElement(innerElement);
        htmlElement.addInnerElement(innerHtmlElement);
        htmlElement.addClosingTag(pattern);
      });
    }

    if (pattern.selected) {
      this.selectedElements.push(element.getElement());
    }

    return [element.getElement(), htmlElement.getElement()];
  }

  private createVisualisation(): void {
    // perform parallel creation of elements for visualization and html editor
    this.level.htmlPattern.forEach((pattern) => {
      const [element, htmlElement] = this.createElement(pattern);
      this.levelView.append(element);
      this.htmlLevelView.append(htmlElement);
    });
  }
}
