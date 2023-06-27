import { LevelData } from 'types';

const LEVEL_DATA: LevelData[] = [
  {
    id: 1,
    task: 'Select the plates',
    name: 'Type Selector',
    title: 'Select elements by their type',
    hint: 'Selects all elements of type A. Type refers to the type of tag, so <div>, <p> and <ul> are all different element types.',
    example: 'div selects all <div> elements',
    selector: 'A',
    solution: 'plate',
    htmlPattern: [
      {
        tag: 'plate',
        selected: true,
        pseudo: {
          tag: 'plate',
        },
      },
      {
        tag: 'plate',
        selected: true,
        pseudo: {
          tag: 'plate',
        },
      },
    ],
  },
  {
    id: 2,
    task: 'Select the fancy plate',
    name: 'ID Selector',
    title: 'Select elements with an ID',
    hint: 'Selects the element with a specific id. You can also combine the ID selector with the type selector.',
    example: '#cool selects any element with id="cool"',
    selector: '#id',
    solution: '#fancy',
    htmlPattern: [
      {
        tag: 'plate',
        id: 'fancy',
        selected: true,
        pseudo: {
          tag: 'plate',
          id: '#fancy',
        },
      },
      {
        tag: 'plate',
        selected: false,
        pseudo: {
          tag: 'plate',
        },
      },
    ],
  },
  {
    id: 3,
    task: 'Select the apple on the plate',
    name: 'Descendant Selector',
    title: 'Select an element inside another element',
    hint: 'Selects all B inside of A. B is called a descendant because it is inside of another element.',
    example: 'p  strong selects all strong elements that are inside of any <p>',
    selector: 'A B',
    solution: 'plate apple',
    htmlPattern: [
      {
        tag: 'plate',
        selected: false,
        pseudo: {
          tag: 'plate',
        },
      },
      {
        tag: 'plate',
        selected: false,
        pseudo: {
          tag: 'plate',
        },
        child: [
          {
            tag: 'apple',
            selected: true,
            pseudo: {
              tag: 'apple',
            },
          },
        ],
      },
      {
        tag: 'apple',
        selected: false,
        pseudo: {
          tag: 'apple',
        },
      },
    ],
  },
  {
    id: 4,
    task: 'Select the small apples',
    name: 'Class Selector',
    title: 'Select elements by their class',
    hint: 'The class selector selects all elements with that class attribute. Elements can only have one ID, but many classes.',
    example: '.neato selects all elements with class="neato"',
    selector: '.classname',
    solution: '.small',
    htmlPattern: [
      {
        tag: 'apple',
        selected: false,
        pseudo: {
          tag: 'apple',
        },
      },
      {
        tag: 'apple',
        selected: true,
        classes: ['small'],
        pseudo: {
          tag: 'apple',
          classes: ['small'],
        },
      },
      {
        tag: 'plate',
        selected: false,
        pseudo: {
          tag: 'plate',
        },
        child: [
          {
            tag: 'apple',
            selected: true,
            classes: ['small'],
            pseudo: {
              tag: 'apple',
              classes: ['small'],
            },
          },
        ],
      },
      {
        tag: 'plate',
        selected: false,
        pseudo: {
          tag: 'plate',
        },
      },
    ],
  },
];

export default LEVEL_DATA;
