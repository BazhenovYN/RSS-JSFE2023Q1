import './_main.scss';
import ElementCreator from 'utils/element-creator';
import View from 'components/common/view';
import Level from 'components/common/level';
import VisualSelector from 'components/visual-selector/visual-selector';
import HtmlEditor from 'components/html-editor/html-editor';
import emitter from 'components/common/event-emmitter';

export default class MainView extends View {
  private visualSelector!: VisualSelector;

  private htmlEditor!: HtmlEditor;

  private levelTask!: ElementCreator;

  constructor(currentLevel: Level) {
    super({ tag: 'main', classes: ['main'] });
    this.configureView();
    this.createLevel(currentLevel);
  }

  public createLevel(currentLevel: Level): void {
    this.levelTask.setTextContent(currentLevel.getTaskLevel());
    this.visualSelector.createLevel(currentLevel);
    this.htmlEditor.createLevel(currentLevel);
  }

  private configureView(): void {
    const helpHandler = (): void => {
      emitter.emit('event:help-click', '');
    };

    this.visualSelector = new VisualSelector();
    this.htmlEditor = new HtmlEditor();
    this.levelTask = new ElementCreator({ tag: 'div', classes: ['task'] });
    const helpButton = new ElementCreator({
      tag: 'button',
      classes: ['help-button'],
      textContent: `Help, I'm stuck!`,
      callback: helpHandler,
    });

    const gameWrapper = new ElementCreator({ tag: 'div', classes: ['game-wrapper'] });
    gameWrapper.addInnerElement(this.levelTask);
    gameWrapper.addInnerElement(helpButton);
    gameWrapper.addInnerElement(this.visualSelector.getHtmlElement());
    gameWrapper.addInnerElement(this.htmlEditor.getHtmlElement());

    this.viewElement.addInnerElement(gameWrapper);
  }

  public getTestingContainer(): HTMLElement {
    return this.visualSelector.getHtmlElement();
  }

  public showWinMessage(): void {
    this.levelTask.setTextContent('Congratulation! Now you are the guru of CSS-selectors!');
  }
}
