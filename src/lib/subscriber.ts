import { Subscription } from './subscription';
import { Observer } from './types';

export class Subscriber<T> implements Observer<T> {
  private closed = false;

  constructor(private destination: Observer<T>, private subscription: Subscription) {
    this.subscription.add(() => (this.closed = true));
  }

  next(value: T) {
    if (!this.closed) {
      this.destination.next(value);
    }
  }

  error(err: any) {
    if (!this.closed) {
      this.closed = true;
      this.destination.error(err);
      this.subscription.unsubscribe();
    }
  }

  complete() {
    if (!this.closed) {
      this.closed = true;
      this.destination.complete();
      this.subscription.unsubscribe();
    }
  }
}
