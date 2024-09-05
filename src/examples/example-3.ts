import { of } from '../lib/functions';
import { map, take } from '../lib/operators';

const array = new Array(100).fill(null).map((_, i) => i + 1);
of(...array)
  .pipe(
    take(5),
    map(x => x ** x),
  )
  .subscribe(console.log);
