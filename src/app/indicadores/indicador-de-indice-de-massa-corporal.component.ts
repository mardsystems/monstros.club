import { Component, Input, OnInit, Output } from '@angular/core';
import { Balanca, IMedidaDeIndiceDeMassaCorporal, CONST_CLASSIFICACAO_INVALIDA } from '../monstros/medidas/medidas-@domain.model';
// import { CONST_CLASSIFICACAO_INVALIDA } from './indicadores.model';

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
    this.executaClassificacao();
  }

  public change(e) {
    this.executaClassificacao();
  }

  private executaClassificacao() {
    try {
      this.classificacao = this.balanca.classificaIndiceDeMassaCorporal(this.medida);
    } catch (ex) {
      this.classificacao = CONST_CLASSIFICACAO_INVALIDA;
    }
  }
}
