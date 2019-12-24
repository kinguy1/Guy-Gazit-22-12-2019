import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { CityInfo, DayDesc } from '../models/city-info';

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})

export class WeatherComponent implements OnInit {
  constructor(public weatherService: WeatherService) { }

  public model: any;
  currentCity: CityInfo;
  faHeart = faHeart;
  backEndIdle: boolean = true;

  ngOnInit() {
    if (this.weatherService.currentCity) {
      this.currentCity = this.weatherService.currentCity;
      this.model = { LocalizedName: this.weatherService.currentCity.name, Key: this.weatherService.currentCity.locationId }
    }
    else {
      this.currentCity = new CityInfo();
      this.model = { LocalizedName: 'Tel Aviv', Key: '215854' };
      this.cityChange();
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((searchText) => this.weatherService.getLocations(searchText)),
    )

  resultFormatCityListValue(value: any) {
    return value.LocalizedName;
  }

  inputFormatCityListValue(value: any) {
    if (value.LocalizedName)
      return value.LocalizedName
    return value;
  }

  cityChange() {
    this.currentCity = new CityInfo();
    this.currentCity.fiveDaysForecast = [];

    this.currentCity.name = this.model.LocalizedName;
    this.currentCity.locationId = this.model.Key;

    if (this.model.Key) {
      this.weatherService.getCurrentCityWeather(this.model.Key).subscribe(response => {
        var relevantData = response[0];
        this.currentCity.currentTemperature = relevantData.Temperature.Metric.Value.toString() + ' ' + relevantData.Temperature.Metric.Unit;
        this.currentCity.currentWeatherDesc = relevantData.WeatherText;
      }, err => this.backEndIdle = false);

      this.weatherService.get5DaysForecastByLocation(this.model.Key).subscribe(res => {
        res.DailyForecasts.forEach(day => {
          let dayDesc = new DayDesc();
          var d = new Date(day.Date);
          var dayName = days[d.getDay()];
          dayDesc.day = dayName;
          dayDesc.temperature = day.Temperature.Maximum.Value.toString() + ' ' + day.Temperature.Maximum.Unit;
          this.currentCity.fiveDaysForecast.push(dayDesc);
        });
      }, err => this.backEndIdle = false);
    }

    if (this.weatherService.favorits.find(f => f.locationId === this.currentCity.locationId)) {
      this.currentCity.isFavorite = true;
    }
  }

  ngOnDestroy() {
    this.weatherService.currentCity = this.currentCity;
  }

  toggleFavorite() {
    this.currentCity.isFavorite ? this.weatherService.removeFavorite(this.currentCity.locationId) : this.weatherService.addFavorite(this.currentCity);
    this.currentCity.isFavorite = !this.currentCity.isFavorite;
  }
}
