import './_html-editor.scss';
import Level from 'components/common/level';
import View from 'components/common/view';
import emitter from 'components/common/event-emmitter';
import UserSelector from './user-selector';
import HtmlViewer from './html-viewer';

export default class HtmlEditor extends View {
  private htmlViewer: HtmlViewer;

  private input: UserSelector;

  constructor() {
    super({ tag: 'div', classes: ['html-editor'] });
    this.input = new UserSelector();
    this.htmlViewer = new HtmlViewer();

    this.viewElement.addInnerElement(this.input.getHtmlElement());
    this.viewElement.addInnerElement(this.htmlViewer);
    emitter.subscribe('event:level-uncompleted', () => this.showErrorMessage());
  }

  public createLevel(currentLevel: Level): void {
    this.htmlViewer.createLevel(currentLevel);
    this.viewElement.addInnerElement(this.htmlViewer);
    this.input.clearInput();
    this.input.setAnswer(currentLevel.getSolution());
  }

  private showErrorMessage(): void {
    this.viewElement.setCssClasses(['html-editor_shake']);
    setTimeout(() => {
      this.viewElement.removeCssClasses(['html-editor_shake']);
    }, 1000);
  }
}
