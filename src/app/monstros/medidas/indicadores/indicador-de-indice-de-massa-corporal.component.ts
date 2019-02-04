import { Component, OnInit, Input, Output } from '@angular/core';
import { IMedidaDeIndiceDeMassaCorporal, Balanca } from '../medidas.model';
import { CONST_CLASSIFICACAO_INVALIDA } from './indicadores.model';

@Component({
  selector: 'indicador-de-indice-de-massa-corporal',
  templateUrl: './indicador-de-indice-de-massa-corporal.component.html',
  styleUrls: ['./indicador-de-indice-de-massa-corporal.component.scss']
})
export class IndicadorDeIndiceDeMassaCorporalComponent implements OnInit {
  @Input() medida: IMedidaDeIndiceDeMassaCorporal;
  @Input() balanca: Balanca;
  @Output() classificacao: number;

  constructor() {

  }

  ngOnInit() {
    try {
      this.classificacao = this.balanca.classificaIndiceDeMassaCorporal(this.medida.indiceDeMassaCorporal);
    } catch (ex) {
      this.classificacao = CONST_CLASSIFICACAO_INVALIDA;
    }
  }
}
