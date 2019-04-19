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
import { CADASTRO_DE_MONSTROS } from './cadastro/monstros-cadastro/@monstros-cadastro-application.model';
import { MonstrosCadastroService } from './cadastro/monstros-cadastro/@monstros-cadastro.service';
import { CONSULTA_DE_MONSTROS } from './cadastro/monstros/@monstros-application.model';
import { Monstro, REPOSITORIO_DE_MONSTROS } from './cadastro/monstros/@monstros-domain.model';
import { MonstrosFirebaseService } from './cadastro/monstros/@monstros-firebase.service';
import { ServicoDeCalculoDeIdade } from './common/common.service';
import { CALCULO_DE_IDADE } from './common/domain.model';
import { FirebaseTransactionManager } from './common/firebase.service';
import { UNIT_OF_WORK } from './common/transactions.model';
import { HomeComponent } from './home/home.component';
import { MedidasFirebaseService } from './monstros/medidas/@medidas-firebase.service';
// import { AuthService } from './auth/auth.service';
// import { MonstrosService } from './monstros/monstros.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PoliticaDePrivacidadeComponent } from './politica-de-privacidade/politica-de-privacidade.component';
import { SobreComponent } from './sobre/sobre.component';
import { TermosDeUsoComponent } from './termos-de-uso/termos-de-uso.component';

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
    { provide: CALCULO_DE_IDADE, useClass: ServicoDeCalculoDeIdade },
    MonstrosFirebaseService,
    { provide: REPOSITORIO_DE_MONSTROS, useClass: MonstrosFirebaseService },
    { provide: CONSULTA_DE_MONSTROS, useClass: MonstrosFirebaseService },
    { provide: CADASTRO_DE_MONSTROS, useClass: MonstrosCadastroService },
    MedidasFirebaseService, // ?
    { provide: UNIT_OF_WORK, useClass: FirebaseTransactionManager },
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
