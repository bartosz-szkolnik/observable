import { Observable, Observer, filter, from, fromEvent, map } from '../lib';

console.clear();

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
    map(x => x + 1),
    filter(x => x % 2 === 0),
    map(x => x + '!!!'),
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

from([1, 2, 3, 4, 5])
  .pipe(map(x => x ** 2))
  .subscribe({
    next(value) {
      console.log(value);
    },
    error() {},
    complete() {},
  });

const button = document.getElementById('btn')!;
const list = document.getElementById('list')!;

fromEvent(button, 'click').subscribe({
  next(_value) {
    const li = document.createElement('li');
    li.textContent = 'Hello mom!';

    list.appendChild(li);
  },
  error() {},
  complete() {},
});

const sub = fromEvent<MouseEvent>(document.body, 'mousemove').subscribe({
  next({ clientX, clientY }) {
    console.log(clientX, clientY);
  },
  error() {},
  complete() {},
});

setTimeout(() => {
  sub.unsubscribe();
}, 10000);
