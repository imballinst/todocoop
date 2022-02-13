import { parseRawTodoText } from '../utils';

describe('parseRawTodoText', () => {
  it('normal line', () => {
    const texts = ['Do something.', '   Do something.', '      Do something.'];

    for (const text of texts) {
      const result = parseRawTodoText(text);

      expect(result).toEqual({
        isChecked: false,
        title: 'Do something.'
      });
    }
  });

  it('list with *', () => {
    const texts = [
      '* Do something.',
      '*    Do something.',
      '*       Do something.'
    ];

    for (const text of texts) {
      const result = parseRawTodoText(text);

      expect(result).toEqual({
        isChecked: false,
        title: 'Do something.'
      });
    }
  });

  it('list with -', () => {
    const texts = [
      '- Do something.',
      '-    Do something.',
      '-       Do something.'
    ];

    for (const text of texts) {
      const result = parseRawTodoText(text);

      expect(result).toEqual({
        isChecked: false,
        title: 'Do something.'
      });
    }
  });

  it('list with numbers', () => {
    const texts = [
      '1. Do something.',
      '12.    Do something.',
      '123.       Do something.'
    ];

    for (const text of texts) {
      const result = parseRawTodoText(text);

      expect(result).toEqual({
        isChecked: false,
        title: 'Do something.'
      });
    }
  });

  it('unticked checkboxes', () => {
    const texts = [
      '- [ ] Do something.',
      '- [ ]    Do something.',
      '- [ ]       Do something.'
    ];

    for (const text of texts) {
      const result = parseRawTodoText(text);

      expect(result).toEqual({
        isChecked: false,
        title: 'Do something.'
      });
    }
  });

  it('ticked checkboxes', () => {
    const texts = [
      '- [x] Do something.',
      '- [x]    Do something.',
      '- [x]       Do something.'
    ];

    for (const text of texts) {
      const result = parseRawTodoText(text);

      expect(result).toEqual({
        isChecked: true,
        title: 'Do something.'
      });
    }
  });
});
