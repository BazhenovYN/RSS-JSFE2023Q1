/* eslint-disable max-lines-per-function */
import Level from 'components/common/level';
import LEVEL_DATA from 'data/data';

describe('level model', () => {
  LEVEL_DATA.forEach((level) => {
    const instance = new Level(level.id);

    describe('getLevelId should return id', () => {
      test(`Level #${level.id}`, () => {
        expect(instance.getLevelId()).toBe(level.id);
      });
    });

    describe('getTaskLevel should return task in format "#task-number task-title"', () => {
      test(`Level #${level.id}`, () => {
        expect(instance.getTaskLevel()).toBe(`#${level.id} ${level.task}`);
      });
    });

    describe('getSolution should return css selector', () => {
      test(`Level #${level.id}`, () => {
        expect(instance.getSolution()).toBe(level.solution);
      });
    });

    describe('getDescription should return level description', () => {
      test(`Level #${level.id}`, () => {
        const description = instance.getDescription();
        expect(description.name).toBe(level.name);
        expect(description.title).toBe(level.title);
        expect(description.hint).toBe(level.hint);
        expect(description.example).toBe(level.example);
        expect(description.selector).toBe(level.selector);
      });
    });

    describe('getLevelVisualisation should return correct level structure', () => {
      test(`Level #${level.id}`, () => {
        const levelView = instance.getLevelVisualisation();
        const wrapper = document.createElement('div');
        wrapper.append(levelView);

        const answer = instance.getAnswer();
        const selector = instance.getSolution();
        const selectedElements = [...wrapper.querySelectorAll(`${selector}:not(.tooltiptext)`)];

        expect(selectedElements).toEqual(expect.arrayContaining(answer));
        expect(answer).toEqual(expect.arrayContaining(selectedElements));
      });
    });
  });
});
