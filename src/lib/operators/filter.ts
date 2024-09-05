import { Observable } from '../observable';
import { MonoTypeOperatorFunction } from '../types';

export function filter<T>(fn: (value: T, index: number) => boolean): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    new Observable<T>(subscriber => {
      let index = 0;
      const subs = source.subscribe({
        next(value: T) {
          if (fn(value, index++)) {
            subscriber.next(value);
          }
        },
        error(err: any) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => {
        subs.unsubscribe();
      };
    });
}
