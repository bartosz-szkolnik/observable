import { Observable } from '../observable';
import { MonoTypeOperatorFunction } from '../types';

export function take<T>(count: number): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    new Observable<T>(subscriber => {
      let currentCount = 0;

      const subs = source.subscribe({
        next(value: T) {
          if (currentCount < count) {
            subscriber.next(value);
            currentCount++;
          } else if (currentCount === count) {
            subscriber.complete();
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
