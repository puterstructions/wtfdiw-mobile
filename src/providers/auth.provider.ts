import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {GooglePlus, Facebook, FacebookLoginResponse, TwitterConnect, TwitterConnectResponse} from 'ionic-native';
import {AngularFire, AuthProviders, AuthMethods, FirebaseAuthState} from 'angularfire2';
import {Observable} from 'rxjs/Observable';

import {GOOGLE_AUTH_KEY} from '../modules/constants';
import {DataProvider} from './data.provider';

@Injectable()
export class AuthProvider {
  user: any;

  constructor(private platform: Platform,
              private firebase: AngularFire,
              private data: DataProvider) {
  }

  getUser() {
    return this.user;
  }

  getKey() {
    return this.user && this.user.$key;
  }

  subscribeToUserAuth() {
    return Observable.create(observer => {
      this.firebase.auth.subscribe((data: FirebaseAuthState) => {
        if (data) {
          this.data.object(`/users/${data.uid}`)
            .subscribe((user) => {
              this.user = user;
              observer.next(user);
            });
        } else {
          observer.next();
          //observer.error();
        }
      });
    });
  }

  loginWithGoogle() {
    return Observable.create(observer => {
      if (this.platform.is('cordova')) {
        this.loginWithGoogleOnCordova(observer);
      } else {
        this.loginWithGoogleOnBrowser(observer);
      }
    });
  }

  loginWithFacebook() {
    return Observable.create(observer => {
      if (this.platform.is('cordova')) {
        this.loginWithFacebookOnCordova(observer);
      } else {
        this.loginWithFacebookOnBrowser(observer);
      }
    });
  }

  loginWithTwitter() {
    return Observable.create(observer => {
      if (this.platform.is('cordova')) {
        this.loginWithTwitterOnCordova(observer);
      } else {
        this.loginWithTwitterOnBrowser(observer);
      }
    });
  }

  createWithEmail(email, password) {
    return Observable.create(observer => {
      this.firebase.auth.createUser({
          email: email,
          password: password,
        })
        .then((data) => observer.next(data))
        .catch((e) => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  loginWithEmail(email, password) {
    return Observable.create(observer => {
      this.firebase.auth.login({
          email: email,
          password: password,
        }, {
          provider: AuthProviders.Password,
          method: AuthMethods.Password,
        })
        .then((data) => this.updateUser(data.auth, 'email', observer))
        .catch((e) => {
          console.log(e);
          observer.error(e);
        });
    });
  }

  logout() {
    this.firebase.auth.logout();
  }

  private loginWithGoogleOnCordova(observer) {
      GooglePlus.login({
          webClientId: GOOGLE_AUTH_KEY
        })
        .then((data: any) => {
          var provider = firebase.auth.GoogleAuthProvider.credential(data.idToken);
          firebase.auth().signInWithCredential(provider)
            .then((data) => this.updateUser(data, 'google', observer))
            .catch((e) => {
              console.log(e);
              observer.error(e);
            });
        })
        .catch((e) => {
          console.log(e);
          observer.error(e);
        });
  }

  private loginWithGoogleOnBrowser(observer) {
    this.firebase.auth.login({
          provider: AuthProviders.Google,
          method: AuthMethods.Popup
        })
        .then((data) => this.updateUser(data.auth, 'google', observer))
        .catch((e) => {
          console.log(e);
          observer.error(e);
        });
  }

  private loginWithFacebookOnCordova(observer) {
      Facebook.login(['email'])
        .then((data: FacebookLoginResponse) => {
          var provider = firebase.auth.FacebookAuthProvider.credential(data.authResponse.accessToken);
          firebase.auth().signInWithCredential(provider)
            .then((data) => this.updateUser(data, 'facebook', observer))
            .catch((e) => {
              console.log(e);
              observer.error(e);
            });
        })
        .catch((e) => {
          console.log(e);
          observer.error(e);
        });
  }

  private loginWithFacebookOnBrowser(observer) {
    this.firebase.auth.login({
        provider: AuthProviders.Facebook,
        method: AuthMethods.Popup
      })
      .then((data) => this.updateUser(data.auth, 'facebook', observer))
      .catch((e) => {
        console.log(e);
        observer.error(e);
      });
  }

  private loginWithTwitterOnCordova(observer) {
      TwitterConnect.login()
        .then((data: TwitterConnectResponse) => {
          var provider = firebase.auth.TwitterAuthProvider.credential(data.token, data.secret);
          firebase.auth().signInWithCredential(provider)
            .then((data) => this.updateUser(data, 'twitter', observer))
            .catch((e) => {
              console.log(e);
              observer.error(e);
            });
        })
        .catch((e) => {
          console.log(e);
          observer.error(e);
        });
  }

  private loginWithTwitterOnBrowser(observer) {
    this.firebase.auth.login({
        provider: AuthProviders.Twitter,
        method: AuthMethods.Popup
      })
      .then((data) => this.updateUser(data.auth, 'twitter', observer))
      .catch((e) => {
        console.log(e);
        observer.error(e);
      });
  }

  private updateUser(data, provider, observer) {
    this.data.list('/users')
      .update(data.uid, {
        provider: provider,
        name: data.displayName,
        email: data.email,
        image: data.photoURL,
      });

    this.data.object(`/users/${data.uid}`)
      .subscribe((user) => {
        this.user = user;
        observer.next(user);
      });
  }
}
