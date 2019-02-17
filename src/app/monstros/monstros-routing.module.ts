import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { MedidasComponent } from './medidas/medidas.component';
import { MonstroPerfilComponent } from './monstro-perfil.component';
import { MonstrosComponent } from './monstros.component';
import { SeriesComponent } from './series/series.component';
import { RankingComponent } from './ranking/ranking.component';
import { RankingsComponent } from './rankings/rankings.component';

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
          { path: 'ranking', component: RankingComponent },
          { path: 'rankings', component: RankingsComponent },
          { path: '', component: MonstroPerfilComponent }
        ]
      }
    ]
  },
  // { path: ':monstro/series', component: SeriesComponent },
  // { path: 'superheroes',  component: HeroListComponent, data: { animation: 'heroes' } },
  // { path: 'superhero/:id', component: HeroDetailComponent, data: { animation: 'hero' } }
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
