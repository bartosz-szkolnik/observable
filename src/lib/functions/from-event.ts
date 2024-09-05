import { Observable } from '../observable';

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
