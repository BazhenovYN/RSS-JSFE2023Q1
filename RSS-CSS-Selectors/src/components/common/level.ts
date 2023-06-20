import { ElementParams, HtmlPattern, LevelData, LevelDescription } from 'types';
import ElementCreator from 'utils/element-creator';
import LEVEL_DATA from 'data/data';

const START_LEVEL = 1;

export default class Level {
  private level: LevelData;

  private levelView: DocumentFragment;

  private selectedElements: HTMLElement[] = [];

  private tooltipElement: ElementCreator[] = [];

  constructor(id = START_LEVEL) {
    this.level = LEVEL_DATA.find((elem) => elem.id === id) ?? LEVEL_DATA[0];
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

  private createTooltip(element: ElementCreator, pattern: HtmlPattern): ElementCreator {
    const tooltip = new ElementCreator({
      tag: 'span',
      classes: ['tooltiptext'],
      textContent: pattern.pseudo.tag,
    });

    const handleMouseEnter = (): void => {
      element.setCssClasses(['tooltip']);
      this.tooltipElement.forEach((item) => item.removeCssClasses(['tooltip']));
      this.tooltipElement.push(element);
    };

    const handleMouseLeave = (): void => {
      this.tooltipElement.pop()?.removeCssClasses(['tooltip']);
      this.tooltipElement.slice(-1)[0]?.setCssClasses(['tooltip']);
    };

    element.setMouseEnterEventListener(handleMouseEnter);
    element.setMouseLeaveEventListener(handleMouseLeave);

    return tooltip;
  }

  private createElement(pattern: HtmlPattern): HTMLElement {
    const param: ElementParams = {
      tag: pattern.tag,
      classes: pattern.classes ?? [],
    };

    const element = new ElementCreator(param);

    element.addInnerElement(this.createTooltip(element, pattern));

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
