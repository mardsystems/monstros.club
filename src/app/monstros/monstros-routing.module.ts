import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MonstrosComponent } from './monstros.component';
import { HomeComponent } from './home/home.component';
import { SeriesComponent } from './series/series.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MonstroNaoEncontradoComponent } from './monstro-nao-encontrado/monstro-nao-encontrado.component';

import { AuthGuard } from '../auth/auth.guard';

const monstrosRoutes: Routes = [
  // { path: 'heroes', redirectTo: '/superheroes' },
  // { path: 'hero/:id', redirectTo: '/superhero/:id' },
  {
    path: '',
    component: MonstrosComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'series', component: SeriesComponent },
          { path: 'medidas', component: MedidasComponent },
          { path: '', component: HomeComponent }
        ]
      }
    ]
  },
  // { path: ':monstro/series', component: SeriesComponent },
  // { path: 'superheroes',  component: HeroListComponent, data: { animation: 'heroes' } },
  // { path: 'superhero/:id', component: HeroDetailComponent, data: { animation: 'hero' } }
  { path: '**', component: MonstroNaoEncontradoComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(monstrosRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MonstrosRoutingModule { }
