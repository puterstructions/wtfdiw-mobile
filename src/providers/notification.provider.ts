import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {LocalNotifications, Coordinates} from 'ionic-native';
import {FirebaseObjectObservable} from 'angularfire2';
import database = firebase.database;
import 'rxjs/add/operator/take'

import {AuthProvider} from './auth.provider';
import {DataProvider} from './data.provider';
import {GeolocationProvider} from './geolocation.provider';
import {WantItem} from '../modules/wants/want.item';

@Injectable()
export class NotificationProvider {
  localNotifications: LocalNotifications;

  private actions: any[];

  constructor(private alertCtrl: AlertController,
              private auth: AuthProvider,
              private data: DataProvider,
              private geolocation: GeolocationProvider) {
    this.actions = [{
      identifier: 'VOTE_YES',
      title: 'Yes',
      icon: 'res://ic_stat_action_thumb_up',
      activationMode: 'background',
      destructive: false,
      authenticationRequired: false,
    }, {
      identifier: 'VOTE_NO',
      title: 'No',
      icon: 'res://ic_stat_action_thumb_down',
      activationMode: 'background',
      destructive: false,
      authenticationRequired: false,
    }, {
      identifier: 'LATER',
      title: 'Later',
      icon: 'res://ic_stat_action_schedule',
      activationMode: 'background',
      destructive: false,
      authenticationRequired: false,
    }];
  }

  listen() {
    LocalNotifications.hasPermission()
      .then((isEnabled) => isEnabled && this.prepareLocalNotifications())
      .catch((e: Error) => console.log(e.message));
  }

  schedule(want: FirebaseObjectObservable<WantItem>, at?: Date) {
    want.take(1)
      .subscribe((item) => {
        LocalNotifications.schedule({
          id: 1,
          title: 'WTFDIW',
          text: item.description,
          icon: 'res://ic_launcher',
          led: 'b97cfc',
          sound: null,
          //at: at,
          actions: this.actions,
          category: 'NOTIFICATION',
          data: {
            wantId: item.$key,
          },
        });
      });
  }

  private prepareLocalNotifications() {
    LocalNotifications.on('click', (notification, state, action) => {
      const wantId: string = JSON.parse(notification.data).wantId;
      switch (action.identifier) {
      case 'VOTE_YES':
        this.vote(wantId, 1);
        break;
      case 'VOTE_NO':
        this.vote(wantId, -1);
        break;
      case 'LATER':
        this.vote(wantId, 0);
        break;
      }
    });
  }

  private vote(wantId: string, vote: number) {
    const samples$ = this.data.list(`/samples/${this.auth.getKey()}/${wantId}`);
    let coords: Coordinates = this.geolocation.getCoords();

    samples$.push({
      vote: vote,
      latitude: coords.latitude,
      longitude: coords.longitude,
      ts: (<any>database).ServerValue.TIMESTAMP
    })
    .then((value: any) => console.log(`new sample: ${value.key}`))
    .catch((e: Error) => console.log(e.message));
  }
}
