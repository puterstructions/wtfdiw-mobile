import {AuthProviders, AuthMethods} from 'angularfire2';

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCa77pheg0bKgodo9Y3UZeWE7pZwKTWbFE',
  authDomain: 'puterstructions-wtfdiw.firebaseapp.com',
  databaseURL: 'https://puterstructions-wtfdiw.firebaseio.com',
  storageBucket: 'puterstructions-wtfdiw.appspot.com',
  messagingSenderId: '573855873198',
};

export const FIREBASE_AUTH_CONFIG = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect,
};

export const GOOGLE_AUTH_KEY = '573855873198-g0pujnvdvbcpfidgpthag4rf6e1a8mt6.apps.googleusercontent.com';
