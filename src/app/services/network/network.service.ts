import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {
    constructor(private network: Network, private platform: Platform) {}

    get onLine(): boolean {
      console.log(this.platform.is('cordova'), this.network && this.network.type, navigator.onLine, this.platform.is('cordova')
          ? !!this.network.type &&
          this.network.type.toLowerCase() !== 'unknown' &&
          this.network.type.toLowerCase() !== 'none'
          : navigator.onLine);

        return this.platform.is('cordova')
            ? !!this.network.type &&
            this.network.type.toLowerCase() !== 'unknown' &&
            this.network.type.toLowerCase() !== 'none'
            : navigator.onLine;
    }
}