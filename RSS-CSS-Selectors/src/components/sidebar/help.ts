import View from "components/common/view";
import Level from "components/common/level";
import { emitter, events } from "components/common/event-emmitter";
import ElementCreator from "utils/element-creator";

import type { GameProgress } from "types";

export default class Help extends View {
  private name!: ElementCreator;

  private title!: ElementCreator;

  private selector!: ElementCreator;

  private hint!: ElementCreator;

  private example!: ElementCreator;

  private stamp!: ElementCreator;

  constructor(currentLevel: Level, progress: GameProgress) {
    super({ tag: 'div', classes: ['help'] });
    this.configureView().update(currentLevel, progress);
    emitter.subscribe(events.levelCompleted, () => this.showStampCompleted());
  }

  private configureView(): Help {
    this.name = new ElementCreator({ tag: 'div', classes: ['help__name'] });
    this.title = new ElementCreator({ tag: 'div', classes: ['help__title'] });
    this.selector = new ElementCreator({ tag: 'div', classes: ['help__selector'] });
    this.hint = new ElementCreator({ tag: 'div', classes: ['help__hint'] });
    this.example = new ElementCreator({ tag: 'div', classes: ['help__example'] });
    this.stamp = new ElementCreator({ tag: 'div', classes: ['level-stamp'] });

    const exampleTitle = new ElementCreator({
      tag: 'div', 
      classes: ['help__example-title'], 
      textContent: 'Example:'
    });

    this.viewElement.addInnerElement(
      this.name,
      this.title,
      this.selector,
      this.hint,
      exampleTitle,
      this.example,
      this.stamp,
    );
    return this;
  }

  public update(currentLevel: Level, progress: GameProgress): void {
    const description = currentLevel.getDescription();
    this.name.setTextContent(description.name);
    this.title.setTextContent(description.title);
    this.selector.setTextContent(description.selector);
    this.hint.setTextContent(description.hint);
    this.example.setTextContent(description.example);
    
    this.stamp.removeCssClasses(['level-stamp_show-fist-time']);
    if (progress.currentLevelCompleted) {
      this.stamp.setCssClasses(['level-stamp_show']);
    } else {
      this.stamp.removeCssClasses(['level-stamp_show']);
    }
  }

  private showStampCompleted(): void {
    this.stamp.setCssClasses(['level-stamp_show-fist-time'])
  }
}
