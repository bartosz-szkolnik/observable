import { BehaviorSubject } from '../lib/behavior-subject';

const subject = new BehaviorSubject(1);
subject.subscribe(value => console.log('without obs', value));

subject.asObservable().subscribe(value => console.log(value));
subject.next(2);
subject.asObservable().subscribe(value => console.log('! ' + value));
subject.next(3);
