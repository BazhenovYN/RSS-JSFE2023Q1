import HeaderView from 'components/view/header/header-view';
import MainView from 'components/view/main/main-view';
import FooterView from 'components/view/footer/footer-view';

export default class App {
  private main: MainView;

  private header: HeaderView;

  private footer: FooterView;

  constructor() {
    this.main = new MainView();
    this.header = new HeaderView();
    this.footer = new FooterView();
  }

  public start(): void {
    document.body.append(
      this.header.getHtmlElement(),
      this.main.getHtmlElement(),
      this.footer.getHtmlElement());
  }
}
