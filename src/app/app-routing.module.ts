import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { FavoritsComponent } from './favorits/favorits.component';

const routes: Routes = [
  { path: '', component: WeatherComponent },
  { path: 'favorits', component: FavoritsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
