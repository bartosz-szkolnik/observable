import { Subject } from '../lib';
import { map, takeUntil } from '../lib/operators';

console.clear();

const subject = new Subject<number>();
const destroy = new Subject<void>();

// subject.subscribe({
//   next(value) {
//     console.log(value);
//   },
//   error(err) {
//     console.error(err);
//   },
//   complete() {
//     console.log('done');
//   },
// });

subject
  .asObservable()
  .pipe(
    takeUntil(destroy),
    map((x: number) => x ** 2),
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

let i = 0;
const id = setInterval(() => {
  subject.next(++i);
}, 1000);

setTimeout(() => {
  destroy.next();
}, 12000);

setTimeout(() => {
  clearInterval(id);
}, 11000);
