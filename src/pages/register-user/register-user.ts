import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController} from 'ionic-angular';

import {AuthProvider} from '../../providers/auth.provider';
import {GeolocationProvider} from '../../providers/geolocation.provider';
import {NotificationProvider} from '../../providers/notification.provider';
import {WantListPage} from '../want-list/want-list';

@Component({
  selector: 'page-register-user',
  templateUrl: 'register-user.html'
})

export class RegisterUserPage {
  form: FormGroup;
  email: string;
  password: string;
  formError: any;

  constructor(private nav: NavController,
              private formBuilder: FormBuilder,
              private auth: AuthProvider,
              private geolocation: GeolocationProvider,
              private notification: NotificationProvider) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  createUserWithEmail() {
    this.auth.createWithEmail(this.email, this.password)
      .subscribe((data) => this.loginRedirectAndListen(),
        e => this.formError = e);
  }

  private loginRedirectAndListen() {
    this.auth.loginWithEmail(this.email, this.password)
      .subscribe((data) => {
        this.nav.setRoot(WantListPage);

        this.geolocation.listen();
        this.notification.listen();
      }, e => this.formError = e);
  }
}
