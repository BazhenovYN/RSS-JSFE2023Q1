import HeaderView from 'components/header/header';
import MainView from 'components/main/main';
import FooterView from 'components/footer/footer';
import Sidebar from 'components/sidebar/sidebar';

export default class App {
  private main: MainView;

  private header: HeaderView;

  private footer: FooterView;

  private sidebar: Sidebar;

  constructor() {
    this.header = new HeaderView();
    this.main = new MainView(1);
    this.sidebar = new Sidebar();
    this.footer = new FooterView();
  }

  public start(): void {
    document.body.append(
      this.header.getHtmlElement(),
      this.main.getHtmlElement(),
      this.sidebar.getHtmlElement(),
      this.footer.getHtmlElement());
  }
}
