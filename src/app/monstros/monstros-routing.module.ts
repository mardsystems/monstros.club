import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { MonstrosCadastroComponent } from '../cadastro/monstros-cadastro/monstros-cadastro.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MonstrosResolverService } from './monstros-resolver.service';
import { MonstrosComponent } from './monstros.component';
import { RankingsItemComponent } from './rankings/rankings-item.component';
import { RankingsComponent } from './rankings/rankings.component';
import { SeriesItemComponent } from './series/series-item.component';
import { SeriesComponent } from './series/series.component';
import { TreinosComponent } from './treinos/treinos.component';
import { PerfilComponent } from './perfil/perfil.component';

const monstrosRoutes: Routes = [
  // { path: 'heroes', redirectTo: '/superheroes' },
  // { path: 'hero/:id', redirectTo: '/superhero/:id' },
  {
    path: '',
    component: MonstrosComponent,
    canActivate: [AuthGuard],
    resolve: {
      monstro: MonstrosResolverService
    },
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'series', component: SeriesComponent, data: { animation: 'series' } },
          { path: 'series/:serieId', component: SeriesItemComponent, data: { animation: 'serie' } },
          { path: 'treinos', component: TreinosComponent, data: { animation: 'treinos' } },
          { path: 'medidas', component: MedidasComponent, data: { animation: 'medidas' } },
          { path: 'rankings', component: RankingsComponent, data: { animation: 'rankings' } },
          { path: 'rankings/:rankingId', component: RankingsItemComponent, data: { animation: 'ranking' } },
          { path: 'configuracoes', component: ConfiguracoesComponent, data: { animation: 'configuracoes' } },
          { path: '', component: PerfilComponent, data: { animation: 'monstro' } }
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
