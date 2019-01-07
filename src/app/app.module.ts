import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { LOCALE_ID } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
// import { MonstrosModule } from './monstros/monstros.module';
import { DoacaoComponent } from './doacao/doacao.component';
import { AuthModule } from './auth/auth.module';

import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MAT_DATE_LOCALE } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { RankingComponent } from './ranking/ranking.component';
import { AdminComponent } from './admin/admin.component';

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
    // MonstrosModule,
    AuthModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt' },
    // { provide: LOCALE_ID, useValue: 'pt' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
