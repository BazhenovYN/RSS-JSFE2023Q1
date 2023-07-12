import { EventHandler, Events } from 'types';

class EventEmitter {
  private events: Events;

  constructor() {
    this.events = {};
  }

  public subscribe(eventName: string, fn: EventHandler): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);
  }

  public emit(eventName: string, data: string): void {
    const event = this.events[eventName];
    if (event) {
      event.forEach((fn) => {
        fn.call(null, data);
      });
    }
  }
}

export const emitter = new EventEmitter();

export const events = {
  levelCompleted: 'event:level-completed',
  levelUncompleted: 'event:level-uncompleted',
  selectorEnter: 'event:selector-enter',
  helpClick: 'event:help-click',
  showLevelList: 'event:show-level-list',
};
