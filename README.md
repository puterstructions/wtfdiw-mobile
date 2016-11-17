WTFDIW [![Build Status](https://travis-ci.org/puterstructions/wtfdiw-mobile.svg)](https://travis-ci.org/puterstructions/wtfdiw-mobile)
======

You can download the latest build of the Android APK [[here](https://puterstructions-wtfdiw.firebaseapp.com/android-debug.apk)].

Work in progress is organized in [Waffle](https://waffle.io/puterstructions/company?source=puterstructions%2Fwtfdiw-mobile)

Run the app locally...

* via Docker: `docker run -p 80:8100 puterstructions/wtfdiw-mobile`
* by building it yourself:

```
npm install
ionic state restore
ionic serve
```

Building `ionic-native` locally for forked changes:

```
cd ionic-native && npm install
npm run build
npm link

cd wtfdiw-mobile
npm link ionic-native
```
