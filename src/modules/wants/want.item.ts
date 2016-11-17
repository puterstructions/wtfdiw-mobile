import {FirebaseListObservable} from 'angularfire2';

import {WantItemSample} from './want.item.sample';

export class WantItem {
  $key: string;
  description: string = '';
  ts: number; //(<any>database).ServerValue.TIMESTAMP;
  samples: FirebaseListObservable<WantItemSample[]>;

  constructor(props) {
    if (props.$key) {
      this.$key = props.$key;
    } else {
      delete this.$key;
    }
    this.description = props.description;
    this.ts = props.ts;
    if (props.samples) {
      this.samples = props.samples;
    } else {
      delete this.samples;
    }
  }
}
