import { Observable } from '../observable';

export function from<T>(array: T[]) {
  return new Observable<T>(observer => {
    array.forEach(value => {
      observer.next(value);
    });

    observer.complete();
    return () => {};
  });
}
