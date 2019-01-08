import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {map} from 'rxjs/operators';
import {Weather} from '../../models/weather';
import {Forecast} from '../../models/forecast';
import {UVIndex} from '../../models/uv-index';
import {Coordinate} from '../../models/coordinate';
import {LocationService} from '../location/location.service';
import {UserPreferencesService} from '../user-preferences/user-preferences.service';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
  private appId = 'e1ca1f13aba3907e78a98e4cd7c26d9d';  // or use your own API key
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  private latitude = 43.073051;
  private longitude = -89.401230;

  constructor(private http: HttpClient, private location: LocationService, private userPreferences: UserPreferencesService) {}

  private getCurrentLocation(): Observable<Coordinate> {
      return from(this.userPreferences.getCity()
          .then(city => city ? city.coordinate : null)
          .then(coordinate => coordinate || this.location.current()));
  }

  current(): Observable<Weather> {
   return this.getCurrentLocation()
       .pipe(flatMap(coord => this.http.get(
           `${this.baseUrl}/weather?lat=${coord.latitude}&lon=${
               coord.longitude
               }&appid=${this.appId}`).pipe(map(this.unpackWeather.bind(this)))));
 }

 forecast(): Observable<Forecast> {
  return this.http.get(
      `${this.baseUrl}/forecast?lat=${this.latitude}&lon=${
        this.longitude
      }&appid=${this.appId}`).pipe(map(this.unpackForecast.bind(this)));
  }

  uvIndex(): Observable<UVIndex> {
   return this.http.get(
     `${this.baseUrl}/uvi?lat=${this.latitude}&lon=${
       this.longitude
     }&appid=${this.appId}`).pipe(map(this.unpackUVIndex.bind(this)));
  }

  private unpackWeather(res: any): Weather {
    return {
      temperature: res.main.temp,
      condition: res.weather[0].id,
      locationName: res.name,
      date: new Date(res.dt * 1000)
    };
  }

  private unpackForecast(res: any): Forecast {
      let currentDay: Array<Weather>;
      let prevDate: number;
      const forecast: Forecast = [];

      res.list.forEach(item => {
          const w = this.unpackWeather(item);
          if (w.date.getDate() !== prevDate) {
              prevDate = w.date.getDate();
              currentDay = [];
              forecast.push(currentDay);
          }
          currentDay.push(w);
      });

      return forecast;
  }

  private unpackUVIndex(res: any): UVIndex {
    let riskLevel = 0;
      if (res.value >= 3) {
          riskLevel = 1;
      }
      if (res.value >= 6) {
          riskLevel = 2;
      }
      if (res.value >= 8) {
          riskLevel = 3;
      }
      if (res.value >= 11) {
          riskLevel = 4;
      }

    return {
        value: res.value,
        riskLevel
    };
  }
}
