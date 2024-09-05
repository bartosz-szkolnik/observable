import { Subscriber } from './subscriber';
import { Subscription } from './subscription';
import { Observer, OperatorFunction, Teardown, UnaryFunction } from './types';

export class Observable<T> {
  constructor(private init: (observer: Observer<T>) => Teardown) {}

  subscribe(observer: Observer<T> | ((value: T) => void)): Subscription {
    const subscription = new Subscription();

    if (typeof observer !== 'function') {
      const subscriber = new Subscriber(observer, subscription);
      subscription.add(this.init(subscriber));
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

    subscription.add(this.init(subscriber));
    return subscription;
  }

  pipe(): Observable<T>;
  pipe<A>(op1: UnaryFunction<Observable<T>, A>): A;
  pipe<A, B>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>): B;
  pipe<A, B, C>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>): C;
  pipe<A, B, C, D>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
  ): D;
  pipe<A, B, C, D, E>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
  ): E;
  pipe<A, B, C, D, E, F>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
  ): F;
  pipe<A, B, C, D, E, F, G>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
  ): G;
  pipe<A, B, C, D, E, F, G, H>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
  ): H;
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
    op9: UnaryFunction<H, I>,
  ): I;
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
    op9: UnaryFunction<H, I>,
    ...operations: OperatorFunction<any, any>[]
  ): Observable<unknown>;
  pipe<A, B, C, D, E, F, G, H, I>(
    op1: UnaryFunction<Observable<T>, A>,
    op2: UnaryFunction<A, B>,
    op3: UnaryFunction<B, C>,
    op4: UnaryFunction<C, D>,
    op5: UnaryFunction<D, E>,
    op6: UnaryFunction<E, F>,
    op7: UnaryFunction<F, G>,
    op8: UnaryFunction<G, H>,
    op9: UnaryFunction<H, I>,
    ...operations: UnaryFunction<any, any>[]
  ): unknown;

  pipe(...operators: UnaryFunction<any, any>[]): unknown {
    return operators.reduce(pipeReducer, this);
  }

  /**
   * @deprecated It isn't done this way anymore. Kept only for educational purposes
   */
  pipeOne<R>(fn: (source: Observable<T>) => Observable<R>): Observable<R> {
    return new Observable<R>(subs => {
      const sub = fn(this).subscribe(subs);
      return () => {
        sub.unsubscribe();
      };
    });
  }

  /**
   * @deprecated It isn't done this way anymore. Kept only for educational purposes
   */
  map<R>(fn: (value: T) => R) {
    return new Observable<R>(subscriber => {
      this.subscribe({
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

      return () => {};
    });
  }
}

function pipeReducer(prev: any, fn: UnaryFunction<any, any>) {
  return fn(prev);
}
