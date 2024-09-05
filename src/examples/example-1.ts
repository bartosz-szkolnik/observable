import { Observable, Observer } from '../lib';
import { filter, map } from '../lib/operators';

const myObservable = new Observable((observer: Observer<number>) => {
  let i = 0;
  observer.next(i++);

  const id = setInterval(() => {
    observer.next(i++);

    if (i > 10) {
      observer.complete();
    }
  }, 500);

  return () => {
    console.log('tearing down');
    clearInterval(id);
  };
});

const subscription = myObservable
  .pipe(
    filter((x: number) => x % 2 === 0),
    map((x: number) => x + 1),
    map((x: number) => x + '!!!'),
  )
  .subscribe({
    next(value) {
      console.log(value);
    },
    error(err) {
      console.error(err);
    },
    complete() {
      console.log('done');
    },
  });

setTimeout(() => {
  subscription.unsubscribe();
}, 10000);
