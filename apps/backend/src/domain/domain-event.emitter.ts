import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function emitDomainEvent(domainEvent: any) {
  eventEmitter.emit('domain-event', domainEvent);
}

export function onDomainEvent<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  domainEvent: new (...args: any[]) => T,
  handler: (domainEvent: T) => void
) {
  eventEmitter.on('domain-event', (event) => {
    if (event instanceof domainEvent) {
      handler(event);
    }
  });
}
