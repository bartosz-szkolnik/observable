import { Observable } from '../observable';
import { Subject } from '../subject';
import { MonoTypeOperatorFunction } from '../types';

export function takeUntil<T>(subject: Subject<any>): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    new Observable<T>(subscriber => {
      const sub = subject.subscribe({
        next() {
          subscriber.complete();
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        },
      });

      const subs = source.subscribe({
        next(value: T) {
          subscriber.next(value);
        },
        error(err: any) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        },
      });

      return () => {
        sub.unsubscribe();
        subs.unsubscribe();
      };
    });
}
