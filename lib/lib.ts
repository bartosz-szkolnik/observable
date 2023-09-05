// type Foo = typeof foo;
// type Bar = typeof bar;
// type Baz = typeof baz;

// type Fn = (a: any) => any;

// type Head<T extends any[]> = T extends [infer H, ...infer _] ? H : never;

// type Last<T extends any[]> = T extends [infer _] ? never : T extends [...infer _, infer Tl] ? Tl : never;

// type Allowed<T extends Fn[], Cache extends Fn[] = []> = T extends []
//   ? Cache
//   : T extends [infer Lst]
//   ? Lst extends Fn
//     ? Allowed<[], [...Cache, Lst]>
//     : never
//   : T extends [infer Fst, ...infer Lst]
//   ? Fst extends Fn
//     ? Lst extends Fn[]
//       ? Head<Lst> extends Fn
//         ? ReturnType<Fst> extends Head<Parameters<Head<Lst>>>
//           ? Allowed<Lst, [...Cache, Fst]>
//           : never
//         : never
//       : never
//     : never
//   : never;

// type FirstParameterOf<T extends Fn[]> = Head<T> extends Fn ? Head<Parameters<Head<T>>> : never;

// type Return<T extends Fn[]> = Last<T> extends Fn ? ReturnType<Last<T>> : never;

// function pipe2<
//   T extends Fn,
//   Fns extends T[],
//   Allow extends {
//     0: [never];
//     1: [FirstParameterOf<Fns>];
//   }[Allowed<Fns> extends never ? 0 : 1],
// >(...args: [...Fns]): (...data: Allow) => Return<Fns>;

// function pipe2<T extends Fn, Fns extends T[], Allow extends unknown[]>(...args: [...Fns]) {
//   return (...data: Allow) => args.reduce((acc, elem) => elem(acc), data);
// }

// const foo = (arg: string) => [1, 2, 3];
// const baz = (arg: number[]) => 42;

// const bar = (arg: number) => ['str'];

// const check = pipe2(foo, baz, bar)('hello'); // string[]
// const check3 = pipe2(baz, bar)([2]); // string[]
// const check2 = pipe2(baz, bar)('hello'); // expected error

// --------------------

export interface Observer<T> {
  next(value: T): void;
  error(err: any): void;
  complete(): void;
}

export type Teardown = () => void;

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

export class Subscription {
  private teardowns: Teardown[] = [];

  add(teardown: Teardown) {
    this.teardowns.push(teardown);
  }

  unsubscribe() {
    for (const teardown of this.teardowns) {
      teardown();
    }

    this.teardowns = [];
  }
}

// fixme
function pipe(...fns: Array<(source: Observable<any>) => Observable<any>>) {
  return (source: Observable<any>) => {
    return fns.reduce((prev, fn) => fn(prev), source);
  };
}

type Operator<T, R = T> = (source: Observable<T>) => Observable<R>;

export class Observable<T> {
  constructor(private init: (observer: Observer<T>) => Teardown) {}

  subscribe(observer: Observer<T>): Subscription {
    const subscription = new Subscription();
    const subscriber = new Subscriber(observer, subscription);

    subscription.add(this.init(subscriber));
    return subscription;
  }

  pipe<R>(...fns: Array<Operator<any>>): Observable<R> {
    return pipe(...fns)(this);
  }

  // pipe2<T extends Fn, Fns extends T[], Allow extends unknown[]>(...args: [...Fns]) {
  //   return (...data: Allow) => args.reduce((acc, elem) => elem(acc), data);
  // }

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
