import { GameProgress } from "types";
import View from "components/common/view";
import ElementCreator from "utils/element-creator";

export default class Menu extends View {
  private title!: ElementCreator;

  public nextButton!: ElementCreator;

  public prevButton!: ElementCreator;
  
  constructor(progress: GameProgress) {
    super({ tag: 'div', classes: ['menu'] });
    this.configureView().update(progress);
  }

  private configureView(): Menu {
    this.title = new ElementCreator({ tag: 'div', classes: ['menu__title'] });
    this.nextButton = new ElementCreator({ tag: 'button', classes: ['btn', 'menu__next'] });
    this.prevButton = new ElementCreator({ tag: 'button', classes: ['btn', 'menu__prev'] });

    const nav = new ElementCreator({ tag: 'div', classes: ['menu__nav'] });
    nav.addInnerElement(this.prevButton, this.nextButton);

    this.viewElement.addInnerElement(
      this.title,
      nav,
    );
    return this;
  }

  public update(progress: GameProgress): void {
    this.title.setTextContent(`Level ${progress.currentLevelNumber} of ${progress.totalLevels}`);
  }
}
