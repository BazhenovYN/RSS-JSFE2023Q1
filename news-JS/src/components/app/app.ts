import { getElement } from '../../utils';
import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
  private readonly controller: AppController;

  private readonly view: AppView;

  constructor() {
    this.controller = new AppController();
    this.view = new AppView();
  }

  public start(): void {
    const sources = getElement<HTMLDivElement>(document, '#sources');
    sources.addEventListener('click', (event) => this.controller.getNews(event, (data) => this.view.drawNews(data)));
    this.controller.getSources((data) => this.view.drawSources(data));

    const search = getElement<HTMLDivElement>(document, '.search');
    search.addEventListener('input', () => this.view.filterSources());
  }
}

export default App;
