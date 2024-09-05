import { Observable } from './observable';
import { Subscriber } from './subscriber';
import { Subscription } from './subscription';
import { Observer } from './types';

export class Subject<T> implements Observer<T> {
  closed = false;
  observers: Subscriber<T>[] = [];

  subscribe(observer: Observer<T> | ((value: T) => void)) {
    const subscription = new Subscription();
    if (typeof observer !== 'function') {
      const subscriber = new Subscriber(observer, subscription);
      this.observers.push(subscriber);
      return subscription;
    }

    const subscriber = new Subscriber(
      {
        next: (value: T) => {
          observer(value);
        },
        error: () => {},
        complete: () => {},
      },
      subscription,
    );

    this.observers.push(subscriber);
    return subscription;
  }

  next(value: T) {
    this.observers.forEach(observer => observer.next(value));
  }

  error(err: any) {
    this.observers.forEach(observer => observer.error(err));
  }

  complete() {
    this.observers.forEach(observer => observer.complete());
  }

  asObservable() {
    const observable = new Observable<T>(observer => {
      const subscription = new Subscription();
      const subscriber = new Subscriber(observer, subscription);

      this.observers.push(subscriber);
      return () => {};
    });

    return observable;
  }
}
