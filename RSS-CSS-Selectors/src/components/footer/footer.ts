import View from 'components/common/view';
import ElementCreator from 'utils/element-creator';

import type { ElementParams } from 'types';

import rssSvg from 'assets/svg/rss.svg';
import githubSvg from 'assets/svg/github.svg';

import './_footer.scss';

export default class FooterView extends View {
  constructor() {
    const params: ElementParams = {
      tag: 'footer',
      classes: ['footer'],
    };
    super(params);
    this.configureView();
  }

  private configureView(): void {
    this.createGithubLogo();
    this.createRssLogo();
  }

  private createRssLogo(): void {
    const anchorRss = new ElementCreator({
      tag: 'a',
      attributes: {
        href: 'https://rs.school/js/',
      },
    });

    const rssLogo = new ElementCreator({
      tag: 'img',
      classes: ['logo', 'rss-logo'],
      attributes: {
        src: rssSvg,
        alt: 'RSSchool',
      },
    });

    anchorRss.addInnerElement(rssLogo);
    this.viewElement.addInnerElement(anchorRss);
  }

  private createGithubLogo(): void {
    const github = new ElementCreator({ tag: 'div', classes: ['github'] });
    const anchorGithub = new ElementCreator({
      tag: 'a',
      attributes: {
        href: 'https://github.com/BazhenovYN',
      },
    });

    const githubLogo = new ElementCreator({
      tag: 'img',
      classes: ['logo', 'github-logo'],
      attributes: {
        src: githubSvg,
        alt: 'GitHub',
      },
    });

    const title = new ElementCreator({
      tag: 'span',
      textContent: '© 2023 BazhenovYN',
    });

    anchorGithub.addInnerElement(githubLogo);
    github.addInnerElement(anchorGithub);
    github.addInnerElement(title);

    this.viewElement.addInnerElement(github);
  }
}
