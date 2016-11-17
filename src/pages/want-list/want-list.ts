import {Component} from '@angular/core';
import {NavController, Loading, LoadingController, ModalController} from 'ionic-angular';
import {FirebaseListObservable} from 'angularfire2';
import 'rxjs/add/operator/map';

import {AuthProvider} from '../../providers/auth.provider';
import {DataProvider} from '../../providers/data.provider';
import {NotificationProvider} from '../../providers/notification.provider';
import {WantItem} from '../../modules/wants/want.item';
import {WantItemSample} from '../../modules/wants/want.item.sample';
import {WantDetailPage} from '../want-detail/want-detail';
import {CreateWantModalPage} from '../modal/create-want-modal';

@Component({
  selector: 'page-want-list',
  templateUrl: 'want-list.html'
})

export class WantListPage {
  wants: FirebaseListObservable<WantItem[]>;
  loader: Loading;
  decidedToggle: boolean = false;

  constructor(private nav: NavController,
              private loading: LoadingController,
              private modal: ModalController,
              private auth: AuthProvider,
              private data: DataProvider,
              private notification: NotificationProvider) {
  }

  ionViewDidLoad() {
    if (!this.loader) {
      this.presentLoading();
    }
    this.setWants();
  }

  decidedToggleChanged(evt) {
    this.setWants();
  }

  getYesTally(samples: FirebaseListObservable<WantItemSample>): number {
    let total: number = 0;
    samples && samples.map(sample => total += (sample.vote === 1 ? 1 : 0));
    return total;
  }

  getNoTally(samples: FirebaseListObservable<WantItemSample>): number {
    let total: number = 0;
    samples && samples.map(sample => total += (sample.vote === -1 ? 1 : 0));
    return total;
  }

  getTallyColor(samples: FirebaseListObservable<WantItemSample>): string {
    let tally = this.tally(samples);
    return tally > 0 ? 'positive' : (tally < 0 ? 'negative' : 'light');
  }

  getTallyIcon(samples: FirebaseListObservable<WantItemSample>): string {
    let tally = this.tally(samples);
    return tally > 0 ? 'trending-up' : (tally < 0 ? 'trending-down' : 'remove');
  }

  navigateToDetail(want: WantItem) {
    this.nav.push(WantDetailPage, {want: want});
  }

  presentCreateWantModal() {
    let modal = this.modal.create(CreateWantModalPage);
    modal.present();
  }

  private presentLoading() {
    this.loader = this.loading.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>
        <div>Loading list of wants... please wait.</div>
      `,
      dismissOnPageChange: true
    });
    this.loader.present();
  }

  private setWants() {
    let bucket: string = this.decidedToggle ? 'decidedWants' : 'wants';
    const wants$ = this.data.list(`/${bucket}/${this.auth.getKey()}`, {
        query: {
          orderByChild: 'ts'
        }
      })
      .map((wants: WantItem[]) => this.mapSamples(wants));
    this.wants = wants$ as FirebaseListObservable<WantItem[]>;
    this.wants.subscribe(() => this.loader.dismiss());
  }

  private mapSamples(wants: WantItem[]): any {
    return wants.map((want: WantItem) => {
      want.samples = this.data.list(`/samples/${this.auth.getKey()}/${want.$key}`);
      return want;
    });
  }

  private tally(samples: FirebaseListObservable<WantItemSample>): number {
    let tally: number = 0;
    samples && samples.map((sample: WantItemSample) => tally += sample.vote);
    return tally;
  }
}
