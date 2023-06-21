import './_html-editor.scss';
import Level from 'components/common/level';
import View from 'components/common/view';
import ElementCreator from 'utils/element-creator';

export default class HtmlEditor extends View {
  private htmlViewer: ElementCreator;

  constructor() {
    super({ tag: 'div', classes: ['html-editor'] });
    this.htmlViewer = new ElementCreator({ tag: 'div', classes: ['html-viewer'] });
    this.viewElement.addInnerElement(this.htmlViewer);
  }

  public createLevel(currentLevel: Level): void {
    const htmlViewer = this.htmlViewer.getElement();
    while (htmlViewer.firstElementChild) {
      htmlViewer.firstElementChild.remove();
    }

    const htmlLevelView = currentLevel.getHtmlLevelVisualisation();
    this.htmlViewer.addInnerElement(htmlLevelView);
    this.viewElement.addInnerElement(this.htmlViewer);
  }
}
