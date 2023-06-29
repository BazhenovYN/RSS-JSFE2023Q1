import { LevelData } from 'types';

const LEVEL_DATA: LevelData[] = [
  {
    id: 1,
    task: 'Select the peppers',
    name: 'Type Selector',
    title: 'Select elements by their type',
    hint: 'Selects all elements of type A. Type refers to the type of tag, so <div>, <p> and <ul> are all different element types.',
    example: 'div selects all <div> elements',
    selector: 'A',
    solution: 'pepper',
    htmlPattern: [
      {
        tag: 'pepper',
        selected: true,
      },
      {
        tag: 'pepper',
        selected: true,
      },
    ],
  },
  {
    id: 2,
    task: 'Select the chili pepper',
    name: 'ID Selector',
    title: 'Select elements with an ID',
    hint: 'Selects the element with a specific id. You can also combine the ID selector with the type selector.',
    example: '#cool selects any element with id="cool"',
    selector: '#id',
    solution: '#chili',
    htmlPattern: [
      {
        tag: 'pepper',
        selected: false,
      },
      {
        tag: 'pepper',
        id: 'chili',
        selected: true,
      },
      {
        tag: 'pepper',
        selected: false,
      },
    ],
  },
  {
    id: 3,
    task: 'Select the eggplant on the basket',
    name: 'Descendant Selector',
    title: 'Select an element inside another element',
    hint: 'Selects all B inside of A. B is called a descendant because it is inside of another element.',
    example: 'p  strong selects all strong elements that are inside of any <p>',
    selector: 'A B',
    solution: 'basket eggplant',
    htmlPattern: [
      {
        tag: 'basket',
        selected: false,
      },
      {
        tag: 'basket',
        selected: false,
        child: [
          {
            tag: 'eggplant',
            selected: true,
          },
        ],
      },
      {
        tag: 'eggplant',
        selected: false,
      },
    ],
  },
  {
    id: 4,
    task: 'Select the small cucumbers',
    name: 'Class Selector',
    title: 'Select elements by their class',
    hint: 'The class selector selects all elements with that class attribute. Elements can only have one ID, but many classes.',
    example: '.neato selects all elements with class="neato"',
    selector: '.classname',
    solution: '.small',
    htmlPattern: [
      {
        tag: 'cucumber',
        selected: false,
      },
      {
        tag: 'cucumber',
        selected: true,
        classes: ['small'],
      },
      {
        tag: 'cucumber',
        selected: true,
        classes: ['small'],
      },
      {
        tag: 'cucumber',
        selected: false,
      },
    ],
  },
  {
    id: 5,
    task: 'Select the small pepper',
    name: 'Class Selector',
    title: 'Combine the Class Selector',
    hint: 'You can combine the class selector with other selectors, like the type selector',
    example: 'ul.important select all <ul> elements that have class="important"',
    selector: 'A.classname',
    solution: 'pepper.small',
    htmlPattern: [
      {
        tag: 'cucumber',
        selected: false,
      },
      {
        tag: 'cucumber',
        selected: false,
        classes: ['small'],
      },
      {
        tag: 'pepper',
        selected: true,
        classes: ['small'],
      },
      {
        tag: 'pepper',
        selected: false,
      },
    ],
  },
  {
    id: 6,
    task: 'Select all vegetables',
    name: 'The Universal Selector',
    title: 'You can select everything!',
    hint: 'You can select all elements with the universal selector!',
    example: 'p * select any element inside all <p> elements',
    selector: '*',
    solution: '*',
    htmlPattern: [
      {
        tag: 'cucumber',
        selected: true,
        classes: ['small'],
      },
      {
        tag: 'pepper',
        selected: true,
      },
      {
        tag: 'pepper',
        id: 'chili',
        selected: true,
      },
      {
        tag: 'carrot',
        selected: true,
      },
    ],
  },
  {
    id: 7,
    task: 'Select every pepper that\'s next to a carrot',
    name: 'Adjacent Sibling Selector',
    title: 'Select an element that directly follows another element',
    hint: 'This selects all B elements that directly follow A. Elements that follow one another are called siblings. They\'re on the same level, or depth. ',
    example: 'p + .intro selects every element with class="intro" that directly follows a <p>',
    selector: 'A + B',
    solution: 'carrot + pepper',
    htmlPattern: [
      {
        tag: 'carrot',
        selected: false,
      },
      {
        tag: 'pepper',
        id: 'chili',
        selected: true,
      },
      {
        tag: 'carrot',
        selected: false,
      },
      {
        tag: 'pepper',
        selected: true,
      },
      {
        tag: 'pepper',
        selected: false,
        classes: ['small'],
      },
    ],
  },
  {
    id: 8,
    task: 'Select first basket',
    name: 'First Child Pseudo-selector',
    title: 'Select a first child element inside of another element',
    hint: 'You can select the first child element. A child element is any element that is directly nested in another element. You can combine this pseudo-selector with other selectors.',
    example: 'p:first-child selects all first child p elements.',
    selector: ':first-child',
    solution: 'basket:first-child',
    htmlPattern: [
      {
        tag: 'basket',
        selected: true,
      },
      {
        tag: 'basket',
        selected: false,
      },
      {
        tag: 'basket',
        selected: false,
      },
    ],
  },
  {
    id: 9,
    task: 'Select last carrot',
    name: 'Last Child Pseudo-selector',
    title: 'Select the last element inside of another element',
    hint: 'You can use this selector to select an element that is the last child element inside of another element.',
    example: 'span:last-child selects all last-child <span> elements.',
    selector: ':last-child',
    solution: 'carrot:last-child',
    htmlPattern: [
      {
        tag: 'carrot',
        selected: false,
      },
      {
        tag: 'carrot',
        selected: false,
      },
      {
        tag: 'carrot',
        selected: false,
      },
      {
        tag: 'carrot',
        selected: true,
      },
    ],
  },
  {
    id: 10,
    task: 'Select the 3rd pepper',
    name: 'Nth Child Pseudo-selector',
    title: 'Select an element by its order in another element',
    hint: 'Selects the n-th (Ex: 1st, 3rd, 12th etc.) child element in another element.',
    example: ':nth-child(8) selects every element that is the 8th child of another element.',
    selector: ':nth-child(A)',
    solution: 'pepper:nth-child(3)',
    htmlPattern: [
      {
        tag: 'pepper',
        selected: false,
      },
      {
        tag: 'pepper',
        selected: false,
        classes: ['small'],
      },
      {
        tag: 'pepper',
        selected: true,
      },
      {
        tag: 'pepper',
        selected: false,
      },
      {
        tag: 'pepper',
        id: 'chili',
        selected: false,
      },
    ],
  },
];

export default LEVEL_DATA;
