import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NavigationExtras, Router } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './home/home.component';
// import { AuthService } from './auth/auth.service';
import { Monstro } from './monstros/monstros.domain-model';
// import { MonstrosService } from './monstros/monstros.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SobreComponent } from './sobre/sobre.component';
import { AuthService } from './auth/auth.service';
import { TermosDeUsoComponent } from './termos-de-uso/termos-de-uso.component';
import { PoliticaDePrivacidadeComponent } from './politica-de-privacidade/politica-de-privacidade.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    SobreComponent,
    TermosDeUsoComponent,
    PoliticaDePrivacidadeComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    FormsModule,
    AppMaterialModule,
    AuthModule,
    AngularFireAuthModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  entryComponents: [
    SobreComponent,
    // IndicadorDeGorduraVisceralComponent,
    // IndicadorDeGorduraComponent,
    // IndicadorDeIndiceDeMassaCorporalComponent,
    // IndicadorDeMusculoComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: FirestoreSettingsToken, useValue: {} },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  monstroLogado$: Observable<Monstro>;

  constructor(
    // private router: Router,
    // private authService: AuthService,
    // private monstrosService: MonstrosService
  ) {
    // this.monstroLogado$ = this.monstrosService.monstroLogado$;

    // this.monstroLogado$.subscribe((monstroLogado) => {
    //   if (monstroLogado) {
    //     // const redirectUrl = this.authService.redirectUrl; // ''; // `${monstroLogado.id}`;

    //     // const navigationExtras: NavigationExtras = {
    //     //   queryParamsHandling: 'preserve',
    //     //   preserveFragment: true
    //     // };

    //     // this.router.navigate([redirectUrl], navigationExtras);
    //   } else {
    //     // this.router.navigate(['/']);
    //   }
    // });
  }
}
