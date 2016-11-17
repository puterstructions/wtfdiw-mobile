import {Component} from '@angular/core';
import {ViewController, NavController, NavParams, ActionSheetController} from 'ionic-angular';
import {FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';

import {AuthProvider} from '../../providers/auth.provider';
import {DataProvider} from '../../providers/data.provider';
import {NotificationProvider} from '../../providers/notification.provider';
import {WantItem} from '../../modules/wants/want.item';
import {WantListPage} from '../../pages/want-list/want-list';

@Component({
  template: `
    <ion-list no-lines class="want-detail-popover">
      <button ion-item (click)="scheduleNotification()">Schedule test notification</button>
      <button ion-item (click)="delete()">Delete want</button>
    </ion-list>
  `
})

export class WantDetailPopoverPage {
  want: FirebaseObjectObservable<WantItem>;

  constructor(private view: ViewController,
              private nav: NavController,
              private navParams: NavParams,
              private actionSheet: ActionSheetController,
              private auth: AuthProvider,
              private data: DataProvider,
              private notification: NotificationProvider) {
    this.want = navParams.get('want');
  }

  scheduleNotification() {
    this.view.dismiss();
    this.notification.schedule(this.want);
  }

  delete() {
    this.view.dismiss();
    let sheet = this.actionSheet.create({
      title: 'Confirm deletion',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            let navTransition = sheet.dismiss();
            this.deleteWant()
              .subscribe(() => {
                navTransition.then(() => this.nav.setRoot(WantListPage));
              });
            return false;
          }
        },{
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });
    sheet.present();
  }

  private deleteWant(): Observable<any> {
    return Observable.create(observer => {
      this.want.take(1)
        .subscribe((data) => {
          this.data.move(`/wants/${this.auth.getKey()}/${data.$key}`,
            `/deletedWants/${this.auth.getKey()}/${data.$key}`)
            .subscribe(() => observer.next(),
              error => observer.error(error));
        });
    });
  }
}
