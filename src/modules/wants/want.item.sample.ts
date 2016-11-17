//import database = firebase.database;

export class WantItemSample {
  $key: string = '';
  vote: number;
  ts: number; //(<any>database).ServerValue.TIMESTAMP;
  latitude: number;
  longitude: number;

  constructor(props) {
    this.$key = props.$key;
    this.vote = props.vote;
    this.ts = props.ts;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
  }
}

