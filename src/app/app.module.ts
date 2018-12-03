import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { LOCALE_ID } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { MedidasComponent } from './medidas/medidas.component';
import { MedidasService } from './medidas/medidas.service';
import { SeriesComponent } from './series/series.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MonstrosComponent } from './monstros/monstros.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DoacaoComponent } from './doacao/doacao.component';
import { MedidaComponent } from './medidas/medida.component';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    MedidasComponent,
    SeriesComponent,
    PageNotFoundComponent,
    MonstrosComponent,
    DoacaoComponent,
    MedidaComponent
  ],
  entryComponents: [
    MedidaComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    FormsModule,
    AppMaterialModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt' },
    // { provide: LOCALE_ID, useValue: 'pt' },
    MedidasService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
