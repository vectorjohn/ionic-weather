import { Component } from '@angular/core';

import { Forecast } from '../models/forecast';
import { IconMapService } from '../services/icon-map/icon-map.service';
import {WeatherService} from '../services/weather/weather.service';
import {UserPreferencesComponent} from '../user-preferences/user-preferences.component';
import {ModalController} from '@ionic/angular';
import {NetworkService} from '../services/network/network.service';

@Component({
  selector: 'app-forecast',
  templateUrl: 'forecast.page.html',
  styleUrls: ['forecast.page.scss']
})
export class ForecastPage {
  forecast: Forecast;

  constructor(public iconMap: IconMapService,
              private weather: WeatherService,
              private modal: ModalController,
              public network: NetworkService) {}

  ionViewDidEnter() {
      this.weather.forecast().subscribe(w => (this.forecast = w));
  }

    async openUserPreferences(): Promise<void> {
        const m = await this.modal.create({ component: UserPreferencesComponent });
        await m.present();
    }
}
