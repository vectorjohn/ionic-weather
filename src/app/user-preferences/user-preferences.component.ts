import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {City} from '../models/city';
import {UserPreferencesService} from '../services/user-preferences/user-preferences.service';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss']
})
export class UserPreferencesComponent implements OnInit {

    cities: Array<City>;
    city: City = {name: 'your mom'};
    useCelcius: boolean;

  constructor(private modal: ModalController, private userPreferencesServices: UserPreferencesService) { }

  ngOnInit() {}

  async ionViewDidEnter() {
      return Promise.all([
          this.userPreferencesServices.availableCities(),
          this.userPreferencesServices.getCity(),
          this.userPreferencesServices.getUseCelcius()
      ]).then(([availableCities, city, useCelcius]) => {
          this.cities = availableCities;
          this.city = city;
          this.useCelcius = useCelcius;
          console.log('set defaults', city);
      });
  }

  dismiss() {
    this.modal.dismiss();
  }

  async save() {
    console.log('save prefs', this.city, this.useCelcius);
    await Promise.all([
        this.userPreferencesServices.setCity(this.city),
        this.userPreferencesServices.setUseCelcius(this.useCelcius)
        ]);
    this.modal.dismiss();
  }

}
