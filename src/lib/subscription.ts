import { Teardown } from './types';

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
