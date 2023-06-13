import { IResponseNews, IResponseSources } from 'types';
import News from 'components/view/news/news';
import Sources from 'components/view/sources/sources';

export class AppView {
  private readonly news: News;

  private readonly sources: Sources;

  constructor() {
    this.news = new News();
    this.sources = new Sources();
  }

  public drawNews(data: IResponseNews): void {
    const values = data?.articles ? data?.articles : [];
    this.news.draw(values);
  }

  public drawSources(data: IResponseSources): void {
    const values = data?.sources ? data?.sources : [];
    this.sources.draw(values);
  }

  public filterSources(): void {
    this.sources.filter();
  }
}

export default AppView;
