import { Observable } from '../observable';
import { OperatorFunction } from '../types';

export function map<T, R>(fn: (value: T, index: number) => R): OperatorFunction<T, R> {
  return (source: Observable<T>) =>
    new Observable<R>(subscriber => {
      let index = 0;

      const subs = source.subscribe({
        next(value: T) {
          subscriber.next(fn(value, index++));
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
