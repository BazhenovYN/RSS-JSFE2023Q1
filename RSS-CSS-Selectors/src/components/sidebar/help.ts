import View from "components/common/view";
import Level from "components/common/level";

export default class Help extends View {
  constructor(currentLevel: Level) {
    super({ tag: 'div', classes: ['help'] });
    this.configureView(currentLevel);
  }

  private configureView(currentLevel: Level): void {
    const description = currentLevel.getDescription();
  }
}
