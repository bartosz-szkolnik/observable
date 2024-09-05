import { Observable } from '../observable';

export function interval(period: number) {
  return new Observable<number>(observer => {
    let index = 0;
    const intervalId = setInterval(() => {
      observer.next(index++);
    }, period);

    return () => {
      clearInterval(intervalId);
    };
  });
}
