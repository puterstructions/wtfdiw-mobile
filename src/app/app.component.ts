import {Component, ViewChild} from '@angular/core';
import {Platform, Nav} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';

import {AuthProvider} from '../providers/auth.provider';
import {DataProvider} from '../providers/data.provider';
import {GeolocationProvider} from '../providers/geolocation.provider';
import {NotificationProvider} from '../providers/notification.provider';
import {LoginPage} from '../pages/login/login';
import {AboutPage} from '../pages/about/about';
import {WantListPage} from '../pages/want-list/want-list';

@Component({
  templateUrl: 'app.html'
})

export class WtfDiw {
  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: any, icon: string}>;
  areUserOptionsToggled: boolean = false;

  private user: any;
  private isAppInitialized: boolean = false;

  constructor(private platform: Platform,
              private auth: AuthProvider,
              private data: DataProvider,
              private geolocation: GeolocationProvider,
              private notification: NotificationProvider) {
    this.initializeApp();

    this.pages = [{
      title: 'Want List',
      component: WantListPage,
      icon: 'list',
    }, {
      title: 'About',
      component: AboutPage,
      icon: 'information-circle',
    }];
  }

  initializeApp() {
    this.platform.ready()
      .then(() => {
        this.getAuthenticatedUser();
        StatusBar.styleDefault();
        Splashscreen.hide();
      });
  }

  getUser() {
    return this.auth.user;
  }

  openPage(page) {
    if (!this.isActivePage(page)) {
      this.nav.push(page.component);
    }
  }

  isActivePage(page) {
    return !!(this.nav.getActive() &&
      this.nav.getActive().component === page.component);
  }

  menuClosed() {
    this.areUserOptionsToggled = false;
  }

  toggleUserOptions(evt?) {
    this.areUserOptionsToggled = !this.areUserOptionsToggled;
  }

  settings() {
  }

  linkUserAccounts() {
  }

  logout() {
    this.auth.logout();
  }

  private getAuthenticatedUser() {
    this.auth.subscribeToUserAuth()
      .subscribe((auth) => {
        if (!auth) {
          this.isAppInitialized = false;
          this.nav.setRoot(LoginPage);
          return;
        }

        if (!this.isAppInitialized) {
          this.isAppInitialized = true;
          this.nav.setRoot(WantListPage);

          this.geolocation.listen();
          this.notification.listen();
        }
        this.user = auth;
      }, e => console.log(e));
  }
}
