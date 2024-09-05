import { from, fromEvent } from '../lib/functions';
import { map } from '../lib/operators';

from([1, 2, 3, 4, 5])
  .pipe(map(x => x ** 2))
  .subscribe({
    next(value) {
      console.log(value);
    },
    error() {},
    complete() {},
  });

from([10, 20, 30, 40, 50])
  .pipe(map(x => x ** 2))
  .subscribe(val => console.log('!!! ', val));

const button = document.getElementById('btn')!;
const list = document.getElementById('list')!;

fromEvent(button, 'click').subscribe({
  next(_value) {
    const li = document.createElement('li');
    li.textContent = 'Hello there!';

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
