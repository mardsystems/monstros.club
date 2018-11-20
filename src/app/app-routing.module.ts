import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { DashboardComponent } from './dashboard/dashboard.component';
// import { MedidasComponent } from './medidas/medidas.component';
// import { SeriesComponent } from './series/series.component';
// import { SerieDetailComponent } from './serie-detail/serie-detail.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'dashboard', component: DashboardComponent },
  // { path: 'medidas', component: MedidasComponent },
  // { path: 'detail/:id', component: SerieDetailComponent },
  // { path: 'series', component: SeriesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
