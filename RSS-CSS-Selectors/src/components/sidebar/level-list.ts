import View from "components/common/view";
import { GameProgress } from "types";

export default class LevelListView extends View {
  constructor(progress: GameProgress) {
    super({ tag: 'div', classes: ['level-list'] });
    this.configureView(progress);
  }

  private configureView(progress: GameProgress): void {

  }
}
