import './_header.scss';
import ElementCreator from "utils/element-creator";
import { ElementParams } from "types";
import View from "components/common/view";
import logo from 'assets/images/chili.png';

export default class HeaderView extends View {
  protected viewElement!: ElementCreator;

  constructor() {
    const params: ElementParams = {
      tag: 'header',
      classes: ['header'],
    }
    super(params);
    this.configureView();
  }

  private configureView(): void {
    this.createGameLogo();
  }

  private createGameLogo(): void {
    const gameLogo = new ElementCreator({tag: 'div', classes: ['game-title']});
    
    const img = new ElementCreator({
      tag: 'img',
      classes: ['game-logo'],
      attributes: {
        src: logo,
        alt: 'RSSchool',
      },
    })

    const title = new ElementCreator({
      tag: 'span',
      textContent: 'CSS Vegan',
    });

    gameLogo.addInnerElement(img);
    gameLogo.addInnerElement(title);
    this.viewElement.addInnerElement(gameLogo);
  }
}
