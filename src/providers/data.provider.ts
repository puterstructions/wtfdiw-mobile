import {Injectable} from '@angular/core';
import {NativeStorage} from 'ionic-native';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/take';
import database = firebase.database;

@Injectable()
export class DataProvider {
  private isConnected: boolean;

  constructor(private firebase: AngularFire) {
    var connectedRef = database().ref('.info/connected');
    connectedRef.on('value', (snap) => {
      console.log('connected? ', snap.val());
      this.isConnected = snap.val();
    });
  }

  object(path: string, opts?: any): FirebaseObjectObservable<any> {
    return new FirebaseObjectObservable<any>((observer: Observer<any>) => {
      if (this.isConnected) {
        this.firebase.database.object(path, opts)
          .take(1)
          .subscribe((data) => {
            NativeStorage.setItem(path, data)
              .then(() => {},
                error => console.log('error storing', path, error));
            observer.next(data);
          });
      } else {
        NativeStorage.getItem(path)
          .then((data) => observer.next(data),
            error => console.log('error fetching', path, error));
      }
    });
  }

  list(path: string, opts?: any): FirebaseListObservable<any> {
    const ref$ = database().ref();
    return new FirebaseListObservable<any>(ref$, (observer: Observer<any>) => {
      if (this.isConnected) {
        this.firebase.database.list(path, opts)
          .take(1)
          .subscribe((data) => {
            NativeStorage.setItem(path, data)
              .then(() => console.log('stored', path),
                error => console.log('error storing', path, error));
            observer.next(data);
          });
      } else {
        NativeStorage.getItem(path)
          .then((data) => observer.next(data),
            error => console.log('error fetching', path, error));
      }
    });
  }

  push(path: string, data: any): Observable<any> {
    return Observable.create(observer => {
      this.firebase.database.list(path)
        .push(data)
        .then(firebaseNewData => {
          let newData: any = firebaseNewData;
          observer.next(newData.path.o[newData.path.o.length - 1]);
        }, error => observer.error(error));
    });
  }

  update(path: string, data: any) {
    this.firebase.database.object(path)
      .update(data);
  }

  remove(path: string): Observable<any> {
    return Observable.create(observer => {
      this.firebase.database.object(path)
        .remove()
        .then(data => {
          observer.next();
        }, error => observer.error(error));
    });
  }

  move(oldPath: string, newPath: string): Observable<any> {
    return Observable.create(observer => {
      this.object(oldPath, {preserveSnapshot: true})
        .take(1)
        .subscribe((snapshot) => {
          this.object(newPath)
            .set(snapshot.val())
            .then(() => {
              this.object(oldPath)
                .remove()
                .then(() => observer.next());
            });
        }, error => observer.error(error));
    });
  }

}
