import { Injectable } from '@angular/core';
import { Geolocation as IonicGeo } from '@ionic-native/geolocation/ngx';

import { Coordinate } from '../../models/coordinate';
import {Platform} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private geolocation: IonicGeo, private platform: Platform) { }

    current(): Promise<Coordinate> {
        return this.platform.is('cordova') ? this.geolocation.getCurrentPosition().then(loc => ({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
        })) : this.webCurrent();
    }

    private webCurrent(): Promise<Coordinate> {
      if (navigator.geolocation) {
          return new Promise<Position>((resolve) => {
              navigator.geolocation
                  .getCurrentPosition(resolve);
          }).then(pos => ({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
          }));
      }

      return Promise.resolve({
          latitude: 12.0464,
          longitude: -77.0428
      });
    }
}