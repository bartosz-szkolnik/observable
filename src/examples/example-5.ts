import { Subject } from '../lib';
import { fromEvent, interval } from '../lib/functions';
import { map, take, takeUntil } from '../lib/operators';

const button = document.getElementById('btn')!;
const subject = new Subject<void>();

fromEvent(button, 'click').subscribe({
  next() {
    subject.next();
  },
  error() {},
  complete() {},
});

interval(1000)
  .pipe(
    takeUntil(subject),
    map(value => value++),
    map(value => 2 ** value),
    take(12),
  )
  .subscribe(value => console.log(value));
