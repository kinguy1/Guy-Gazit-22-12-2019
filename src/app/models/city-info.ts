export class CityInfo {
    locationId: string;
    name: string;
    currentTemperature: string;
    currentWeatherDesc: string;
    fiveDaysForecast: DayDesc[];
    isFavorite: boolean;
}

export class DayDesc {
    day: string;
    temperature: string;
}