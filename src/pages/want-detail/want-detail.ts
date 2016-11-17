import {Component} from '@angular/core';
import {NavController, NavParams, Popover, PopoverController} from 'ionic-angular';
import {FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import {AuthProvider} from '../../providers/auth.provider';
import {DataProvider} from '../../providers/data.provider';
import {WantItem} from '../../modules/wants/want.item';
import {WantItemSample} from '../../modules/wants/want.item.sample';
import {WantDetailPopoverPage} from '../popover/want-detail-popover';

@Component({
  selector: 'page-want-detail',
  templateUrl: 'want-detail.html'
})

export class WantDetailPage {
  want: FirebaseObjectObservable<WantItem>;
  samples: FirebaseListObservable<WantItemSample[]>;
  areNotificationsDisabled: boolean = false;

  private yesTally: number = 0;
  private noTally: number = 0;
  private latestSampleTs: number;
  private wantDetailPopover: Popover;

  constructor(private nav: NavController,
              private navParams: NavParams,
              private auth: AuthProvider,
              private data: DataProvider,
              private popover: PopoverController) {
  }

  ionViewDidLoad() {
    let key = this.navParams.get('want').$key;
    this.want = this.data.object(`/wants/${this.auth.getKey()}/${key}`);
    this.samples = this.data.list(`/samples/${this.auth.getKey()}/${key}`);

    this.data.list(`/samples/${this.auth.getKey()}/${key}`, {
        query: {
          orderByChild: 'ts',
          limitToLast: 1,
        }
      })
      .subscribe((samples: WantItemSample[]) => {
        if (samples.length) {
          this.latestSampleTs = samples[0].ts;
        }
      });

    this.samples.subscribe((samples: WantItemSample[]) => {
      this.yesTally = 0;
      this.noTally = 0;

      samples.map((sample: WantItemSample) => {
        switch (sample.vote) {
        case 1:
          this.yesTally++;
          break;
        case -1:
          this.noTally++;
          break;
        }
      });
    });
  }

  getLatestSampleTs(): number {
    return this.latestSampleTs;
  }

  getYesTally(): number {
    return this.yesTally;
  }

  getNoTally(): number {
    return this.noTally;
  }

  toggleNotifications() {
    this.areNotificationsDisabled = !this.areNotificationsDisabled;
  }

  presentPopover(evt) {
    this.wantDetailPopover = this.popover.create(WantDetailPopoverPage, {
      want: this.want
    });
    this.wantDetailPopover.present({ev: evt});
  }
}
