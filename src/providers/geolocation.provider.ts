import {Injectable} from '@angular/core';
import {Geoposition, Geolocation} from 'ionic-native';

@Injectable()
export class GeolocationProvider {
  private subscription: any;
  private coords: any = {
    longitude: 0,
    latitude: 0,
  };

  constructor() {
  }

  listen() {
    this.subscription = Geolocation.watchPosition()
      .subscribe((position: Geoposition) => this.coords = position.coords);
  }

  stop() {
    this.subscription.unsubscribe();
  }

  getCoords(): any {
    return this.coords;
  }
}
