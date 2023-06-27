import ElementCreator from 'utils/element-creator';
import Level from 'components/common/level';
import LineEnumerator from './line-enumerator';

export default class HtmlViewer extends ElementCreator {
  private markup: ElementCreator;

  constructor() {
    super({ tag: 'div', classes: ['hljs', 'html-viewer'] });
    const lineEnumerator = new LineEnumerator();
    this.markup = new ElementCreator({ tag: 'div', classes: ['markup'] });

    this.addInnerElement(lineEnumerator);
    this.addInnerElement(this.markup);
  }

  public createLevel(currentLevel: Level): void {
    const markup = this.markup.getElement();
    while (markup.firstElementChild) {
      markup.firstElementChild.remove();
    }

    const htmlLevelView = currentLevel.getHtmlLevelVisualisation();
    this.markup.addInnerElement(htmlLevelView);
  }
}
