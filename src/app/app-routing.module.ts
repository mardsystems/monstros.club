import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminGuard } from './auth/admin.guard';
import { TermosDeUsoComponent } from './termos-de-uso/termos-de-uso.component';
import { PoliticaDePrivacidadeComponent } from './politica-de-privacidade/politica-de-privacidade.component';
// import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

const appRoutes: Routes = [
  // {
  //   path: 'compose',
  //   component: ComposeMessageComponent,
  //   outlet: 'popup'
  // },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canLoad: [AdminGuard],
    data: {
      animation: 'admin'
    }
  },
  // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: '404', component: PageNotFoundComponent },
  { path: 'termos-de-uso', component: TermosDeUsoComponent },
  { path: 'politica-de-privacidade', component: PoliticaDePrivacidadeComponent },
  {
    path: ':monstroId',
    loadChildren: './monstros/monstros.module#MonstrosModule',
    canLoad: [AuthGuard],
    data: {
      animation: 'monstros',
      //  preload: true
    }
  },
  {
    path: '',
    component: HomeComponent, data: { animation: 'home' }
  },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        // urlUpdateStrategy: 'deferred' | 'eager',
        // preloadingStrategy: PreloadAllModules // SelectivePreloadingStrategyService
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
