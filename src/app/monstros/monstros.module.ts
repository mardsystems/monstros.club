import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedidaComponent } from './medidas/medida.component';
import { MedidasComponent } from './medidas/medidas.component';
import { MedidasService } from './medidas/medidas.service';
import { MonstroNaoEncontradoComponent } from './monstro-nao-encontrado/monstro-nao-encontrado.component';
import { MonstrosMaterialModule } from './monstros-material.module';
import { MonstrosRoutingModule } from './monstros-routing.module';
import { MonstrosComponent } from './monstros.component';
import { SeriesComponent } from './series/series.component';
import { MonstroPerfilComponent } from './monstro-perfil.component';

@NgModule({
  declarations: [
    MonstrosComponent,
    MedidaComponent,
    MedidasComponent,
    SeriesComponent,
    MonstroNaoEncontradoComponent,
    MonstroPerfilComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MonstrosMaterialModule,
    MonstrosRoutingModule
  ],
  entryComponents: [
    MedidaComponent
  ],
  providers: [
    MedidasService
  ]
})
export class MonstrosModule { }
