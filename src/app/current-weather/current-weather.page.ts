import { Component, OnInit } from '@angular/core';

import { IconMapService } from '../services/icon-map/icon-map.service';
import { Weather } from '../models/weather';
import {WeatherService} from '../services/weather/weather.service';
import {LoadingController, ModalController} from '@ionic/angular';
import {UserPreferencesComponent} from '../user-preferences/user-preferences.component';
import {UserPreferencesService} from '../services/user-preferences/user-preferences.service';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'app-current-weather',
  templateUrl: 'current-weather.page.html',
  styleUrls: ['current-weather.page.scss']
})
export class CurrentWeatherPage implements OnInit {
  currentWeather: Weather;
  cityName: string;
  scale: string;

  private subscription: Subscription;

  constructor(public iconMap: IconMapService,
              private weather: WeatherService,
              private loading: LoadingController,
              private modal: ModalController,
              private userPreferences: UserPreferencesService) { }

  ngOnInit() {
      this.subscription = this.userPreferences.changed.subscribe(() =>
          this.getData()
      );
  }

  async ionViewDidEnter() {
      this.getData();
  }

    async openUserPreferences(): Promise<void> {
        const m = await this.modal.create({ component: UserPreferencesComponent });
        await m.present();
    }

    private async getData() {
        const l = await this.loading.create({
            message: 'Loading...'
        });
        l.present();
        this.cityName = (await this.userPreferences.getCity()).name;
        this.scale = (await this.userPreferences.getUseCelcius()) ? 'C' : 'F';
        this.weather.current().subscribe(w => {
            this.currentWeather = w;
            l.dismiss();
        });
    }
}
