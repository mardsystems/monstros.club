import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MonstroPerfilComponent } from './monstro-perfil.component';
import { MonstrosComponent } from './monstros.component';
import { RankingsComponent } from './rankings/rankings.component';
import { SeriesComponent } from './series/series.component';
import { TreinosComponent } from './treinos/treinos.component';

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
          { path: 'treinos', component: TreinosComponent },
          { path: 'medidas', component: MedidasComponent },
          { path: 'rankings', component: RankingsComponent },
          // { path: 'rankings/:rankingId', component: RankingComponent },
          { path: 'configuracoes', component: ConfiguracoesComponent },
          { path: '', component: MonstroPerfilComponent }
        ]
      }
    ]
  },
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
