import { Observable } from './observable';
import { Subject } from './subject';
import { Subscriber } from './subscriber';
import { Subscription } from './subscription';
import { Observer } from './types';

export class BehaviorSubject<T> extends Subject<T> {
  constructor(private state: T) {
    super();
  }

  override next(value: T) {
    this.state = value;
    super.next(this.state);
  }

  override subscribe(observer: Observer<T> | ((value: T) => void)) {
    const subscription = new Subscription();
    if (typeof observer !== 'function') {
      const subscriber = new Subscriber(observer, subscription);
      this.observers.push(subscriber);
      return subscription;
    }

    const subscriber = new Subscriber(
      {
        next: (value: T) => {
          this.state = value;
          observer(value);
        },
        error: () => {},
        complete: () => {},
      },
      subscription,
    );

    this.observers.push(subscriber);
    subscriber.next(this.state);
    return subscription;
  }

  override asObservable() {
    const observable = new Observable<T>(observer => {
      const subscription = new Subscription();
      const subscriber = new Subscriber(observer, subscription);

      this.observers.push(subscriber);
      subscriber.next(this.state);
      return () => {};
    });

    return observable;
  }
}
