// import { LOCALE_ID } from '@angular/core';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationExtras, Router } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AdminComponent } from './admin/admin.component';
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { DoacaoComponent } from './doacao/doacao.component';
import { HomeComponent } from './home/home.component';
import { Monstro } from './monstros/monstros.model';
import { MonstrosService } from './monstros/monstros.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RankingComponent } from './ranking/ranking.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DoacaoComponent,
    HomeComponent,
    RankingComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    FormsModule,
    AppMaterialModule,
    AuthModule,
    AngularFireAuthModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt' },
    // { provide: LOCALE_ID, useValue: 'pt' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  monstroLogado$: Observable<Monstro>;

  constructor(
    private router: Router,
    private monstrosService: MonstrosService
  ) {
    this.monstroLogado$ = this.monstrosService.monstroLogado$;

    this.monstroLogado$.subscribe((monstroLogado) => {
      if (monstroLogado != null) {
        const redirectUrl = `${monstroLogado.id}`;

        const navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        this.router.navigate([redirectUrl], navigationExtras);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
