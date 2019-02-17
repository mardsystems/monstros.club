import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';
import { MonstroNaoEncontradoComponent } from './monstro-nao-encontrado/monstro-nao-encontrado.component';

const appRoutes: Routes = [
  // {
  //   path: 'compose',
  //   component: ComposeMessageComponent,
  //   outlet: 'popup'
  // },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: '404', component: MonstroNaoEncontradoComponent },
  {
    path: ':monstroId',
    loadChildren: './monstros/monstros.module#MonstrosModule',
    canLoad: [AuthGuard],
    // data: { preload: true }
  },
  { path: '', component: HomeComponent },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        // urlUpdateStrategy: 'deferred' | 'eager',
        preloadingStrategy: PreloadAllModules // SelectivePreloadingStrategyService
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
