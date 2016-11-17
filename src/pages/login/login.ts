import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController} from 'ionic-angular';
import 'rxjs/add/operator/take'

import {AuthProvider} from '../../providers/auth.provider';
import {NotificationProvider} from '../../providers/notification.provider';
import {RegisterUserPage} from '../register-user/register-user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  form: FormGroup;
  email: string;
  password: string;
  formError: any;
  providerError: any;

  constructor(private nav: NavController,
              private formBuilder: FormBuilder,
              private auth: AuthProvider,
              private notification: NotificationProvider) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginUserWithGoogle() {
    this.auth.loginWithGoogle()
      .take(1)
      .subscribe((data) => data, e => this.providerError = e);
  }

  loginUserWithFacebook() {
    this.auth.loginWithFacebook()
      .take(1)
      .subscribe((data) => data, e => this.providerError = e && e.errorMessage);
  }

  loginUserWithTwitter() {
    this.auth.loginWithTwitter()
      .take(1)
      .subscribe((data) => data, e => this.providerError = e);
  }

  loginUserWithEmail() {
    this.auth.loginWithEmail(this.email, this.password)
      .take(1)
      .subscribe((data) => data, e => this.formError = e);
  }

  navigateToUserRegistration() {
    this.nav.push(RegisterUserPage);
  }
}
