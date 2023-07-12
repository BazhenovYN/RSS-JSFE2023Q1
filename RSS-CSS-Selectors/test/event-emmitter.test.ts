import { emitter } from 'components/common/event-emmitter';

describe('event emmitter', () => {
  it('should handle events', () => {
    const callback = jest.fn();
    const value = 'message';

    emitter.subscribe('event:something', (data) => callback(data));

    emitter.emit('event:something', value);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(value);
  });
});
