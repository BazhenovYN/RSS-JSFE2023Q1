import { HtmlPattern } from 'types';
import { getHtmlString } from 'utils/utils';

describe('utils', () => {
  describe('getHtmlString should creates tag html', () => {
    it('should creates single <div/>', () => {
      const pattern: HtmlPattern = { tag: 'div', selected: false };
      expect(getHtmlString(pattern, false)).toBe('<div/>');
    });

    it('should creates opening <div>', () => {
      const pattern: HtmlPattern = { tag: 'div', selected: false, child: [{ tag: 'div', selected: false }] };
      expect(getHtmlString(pattern, false)).toBe('<div>');
    });

    it('should creates closing </div>', () => {
      const pattern: HtmlPattern = { tag: 'div', selected: false };
      expect(getHtmlString(pattern, true)).toBe('</div>');
    });

    it('should creates <div id="id"/>', () => {
      const pattern: HtmlPattern = { tag: 'div', selected: false, id: 'id' };
      expect(getHtmlString(pattern, false)).toBe('<div id="id"/>');
    });

    it('should creates <div id="id" class="class"/>', () => {
      const pattern: HtmlPattern = { tag: 'div', selected: false, id: 'id', classes: ['class'] };
      expect(getHtmlString(pattern, false)).toBe('<div id="id" class="class"/>');
    });
  });
});
