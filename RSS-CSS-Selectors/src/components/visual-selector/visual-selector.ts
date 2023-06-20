import './_visual-selector.scss';
import Level from 'components/common/level';
import View from "components/common/view";

export default class VisualSelector extends View {
    
  constructor() {
    super({ tag: 'div', classes: ['table-wrapper'] });
  }

  public createLevel(currentLevel: Level): void {
    const table = this.viewElement.getElement();
    while (table.firstElementChild) {
      table.firstElementChild.remove();
    }

    const levelView = currentLevel.getLevelVisualisation();
    this.viewElement.addInnerElement(levelView);
  }
}
