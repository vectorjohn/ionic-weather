import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import {City} from '../../models/city';
import {cities} from './cities';

@Injectable({
    providedIn: 'root'
})
export class UserPreferencesService {

    changed: Subject<void>;

    private keys = {
        useCelcius: 'useCelcius',
        city: 'city'
    };
    private _useCelcius: boolean;
    private _city: City;

    constructor(private storage: Storage) {
        this.changed = new Subject();
    }

    async getUseCelcius(): Promise<boolean> {
        await this.storage.ready();
        if (this._useCelcius === undefined) {
            this._useCelcius = await this.storage.get(this.keys.useCelcius);
        }
        return this._useCelcius;
    }

    async setUseCelcius(value: boolean): Promise<void> {
        await this.storage.ready();
        this._useCelcius = value;
        this.storage.set(this.keys.useCelcius, value);
        this.changed.next();
    }

    async getCity(): Promise<City> {
        await this.storage.ready();
        if (this._city === undefined) {
            const city = await this.storage.get(this.keys.city);
            this._city = city && cities.find(c => c.name === city.name) || cities[0];
        }
        return this._city;
    }

    async setCity(value: City): Promise<void> {
        await this.storage.ready();
        this._city = value;
        this.storage.set(this.keys.city, value);
        this.changed.next();
    }

    async availableCities(): Promise<City[]> {
      return cities;
    }
}