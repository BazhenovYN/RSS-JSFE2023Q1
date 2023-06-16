import HeaderView from 'components/view/header/header-view';
import MainView from 'components/view/main/main-view';
import FooterView from 'components/view/footer/footer-view';
import Sidebar from 'components/sidebar/sidebar-view';

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
