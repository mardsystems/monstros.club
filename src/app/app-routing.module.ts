import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MonstrosComponent } from './monstros/monstros.component';
import { SeriesComponent } from './series/series.component';
import { MedidasComponent } from './medidas/medidas.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: MonstrosComponent },
  { path: 'medidas', component: MedidasComponent },
  { path: 'series', component: SeriesComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
