import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CityInfo } from '../models/city-info';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  public currentCity: CityInfo;

  baseApiUrl: string = "http://dataservice.accuweather.com/";
  private readonly _favorits = new BehaviorSubject<CityInfo[]>([]);

  readonly favorits$ = this._favorits.asObservable();

  get favorits(): CityInfo[] {
    return this._favorits.getValue();
  }

  set favorits(val: CityInfo[]) {
    this._favorits.next(val);
  }

  addFavorite(newFavorite: CityInfo) {
    if (!this.favorits.find(f => f.locationId === newFavorite.locationId)) {
      this.favorits = [
        ...this.favorits,
        newFavorite
      ];
    }
  }

  removeFavorite(id: string) {
    this.favorits = this.favorits.filter(favorite => favorite.locationId !== id);
  }

  constructor(private http: HttpClient) { }

  getLocations(key: string) {
    return this.http.get<any>(this.baseApiUrl + 'locations/v1/cities/autocomplete' + '?apikey=V0xGeEWaH8b1EkZuwgAkwrniKzhqqQjD&q=' + key);
  }

  get5DaysForecastByLocation(locationId: string) {
    return this.http.get<any>(this.baseApiUrl + '/forecasts/v1/daily/5day/' + locationId + '?apikey=V0xGeEWaH8b1EkZuwgAkwrniKzhqqQjD&metric=true');
  }

  getCurrentCityWeather(locationId: string) {
    return this.http.get<any>(this.baseApiUrl + 'currentconditions/v1/' + locationId + '?apikey=V0xGeEWaH8b1EkZuwgAkwrniKzhqqQjD&metric=true');
  }
}
