import { Observable } from './lib';

export const map =
  <T, R>(fn: (value: T) => R) =>
  (source: Observable<T>) => {
    return new Observable<R>(subscriber => {
      const subs = source.subscribe({
        next(value: T) {
          subscriber.next(fn(value));
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
  };

export const filter =
  <T>(fn: (value: T) => boolean) =>
  (source: Observable<T>) => {
    return new Observable<T>(subscriber => {
      const subs = source.subscribe({
        next(value: T) {
          if (fn(value)) {
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
  };
