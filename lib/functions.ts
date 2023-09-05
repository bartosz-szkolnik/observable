import { Observable } from './lib';

export function from<T>(array: T[]) {
  return new Observable(observer => {
    array.forEach(value => {
      observer.next(value);
    });

    observer.complete();

    return () => {};
  });
}

export function fromEvent<T extends Event>(element: HTMLElement, eventName: keyof HTMLElementEventMap) {
  return new Observable<T>(observer => {
    const listener: EventListener = event => {
      observer.next(event as T);
    };

    element.addEventListener(eventName, listener);
    return () => {
      element.removeEventListener(eventName, listener);
    };
  });
}
