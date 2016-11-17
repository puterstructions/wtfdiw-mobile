import {NgModule, LOCALE_ID} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {AngularFireModule} from 'angularfire2';

import {WtfDiw} from './app.component';
import {FIREBASE_CONFIG, FIREBASE_AUTH_CONFIG} from '../modules/constants';

import {AuthProvider} from '../providers/auth.provider';
import {DataProvider} from '../providers/data.provider';
import {GeolocationProvider} from '../providers/geolocation.provider';
import {NotificationProvider} from '../providers/notification.provider';
import {AboutPage} from '../pages/about/about';
import {LoginPage} from '../pages/login/login';
import {RegisterUserPage} from '../pages/register-user/register-user';
import {WantDetailPage} from '../pages/want-detail/want-detail';
import {WantListPage} from '../pages/want-list/want-list';
import {CreateWantModalPage} from '../pages/modal/create-want-modal';
import {WantDetailPopoverPage} from '../pages/popover/want-detail-popover';

@NgModule({
  declarations: [
    WtfDiw,
    AboutPage,
    LoginPage,
    RegisterUserPage,
    WantDetailPage,
    WantListPage,
    CreateWantModalPage,
    WantDetailPopoverPage,
  ],
  imports: [
    IonicModule.forRoot(WtfDiw),
    AngularFireModule.initializeApp(FIREBASE_CONFIG, FIREBASE_AUTH_CONFIG),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WtfDiw,
    AboutPage,
    LoginPage,
    RegisterUserPage,
    WantDetailPage,
    WantListPage,
    CreateWantModalPage,
    WantDetailPopoverPage,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' },
    AuthProvider,
    DataProvider,
    GeolocationProvider,
    NotificationProvider,
  ]
})

export class WtfDiwModule {
}
