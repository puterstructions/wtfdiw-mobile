import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';

@Injectable()
export class DataProvider {

  constructor(private firebase: AngularFire) {
  }

  object(path: string, opts?: any): FirebaseObjectObservable<any> {
    return this.firebase.database.object(path, opts);
  }

  list(path: string, opts?: any): FirebaseListObservable<any> {
    return this.firebase.database.list(path, opts);
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
