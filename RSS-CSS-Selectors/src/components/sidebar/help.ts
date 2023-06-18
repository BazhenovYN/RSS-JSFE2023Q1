import View from "components/common/view";
import Level from "components/common/level";
import ElementCreator from "utils/element-creator";

export default class Help extends View {
  private name!: ElementCreator;

  private title!: ElementCreator;

  private selector!: ElementCreator;

  private hint!: ElementCreator;

  private example!: ElementCreator;

  constructor(currentLevel: Level) {
    super({ tag: 'div', classes: ['help'] });
    this.configureView().update(currentLevel);
  }

  private configureView(): Help {
    this.name = new ElementCreator({ tag: 'div', classes: ['help__name'] });
    this.title = new ElementCreator({ tag: 'div', classes: ['help__title'] });
    this.selector = new ElementCreator({ tag: 'div', classes: ['help__selector'] });
    this.hint = new ElementCreator({ tag: 'div', classes: ['help__hint'] });
    this.example = new ElementCreator({ tag: 'div', classes: ['help__example'] });

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
    );
    return this;
  }

  public update(currentLevel: Level): void {
    const description = currentLevel.getDescription();
    this.name.setTextContent(description.name);
    this.title.setTextContent(description.title);
    this.selector.setTextContent(description.selector);
    this.hint.setTextContent(description.hint);
    this.example.setTextContent(description.example);
  }
}
