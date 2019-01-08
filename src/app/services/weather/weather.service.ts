import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import {Weather} from '../../models/weather';
import {Forecast} from '../../models/forecast';
import {UVIndex} from '../../models/uv-index';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
  private appId = '69f068bb8bf2bc3e061cb2b62c255c65';  // or use your own API key
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  private latitude = 43.073051;
  private longitude = -89.401230;

  constructor(private http: HttpClient) {}

  current(): Observable<Weather> {
   return this.http.get(
     `${this.baseUrl}/weather?lat=${this.latitude}&lon=${
       this.longitude
     }&appid=${this.appId}`).pipe(map(this.unpackWeather.bind(this)));
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
