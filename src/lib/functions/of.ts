import { Observable } from '../observable';

export function of<T>(...items: T[]) {
  return new Observable<T>(observer => {
    items.forEach(value => {
      observer.next(value);
    });

    observer.complete();
    return () => {};
  });
}
