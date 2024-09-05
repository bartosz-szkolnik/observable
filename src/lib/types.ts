import { type Observable } from './observable';

export type Teardown = () => void;

export interface Observer<T> {
  next(value: T): void;
  error(err: any): void;
  complete(): void;
}

export interface UnaryFunction<T, R> {
  (source: T): R;
}

export interface OperatorFunction<T, R> extends UnaryFunction<Observable<T>, Observable<R>> {}

export interface MonoTypeOperatorFunction<T> extends OperatorFunction<T, T> {}
