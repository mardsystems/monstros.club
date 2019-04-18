import { Component, Input, OnInit, Output } from '@angular/core';
import { Balanca, CONST_CLASSIFICACAO_INVALIDA, IMedidaDeMusculo } from '../monstros/medidas/@medidas-domain.model';
// import { CONST_CLASSIFICACAO_INVALIDA } from './indicadores.model';

@Component({
  selector: 'indicador-de-musculo',
  templateUrl: './indicador-de-musculo.component.html',
  styleUrls: ['./indicador-de-musculo.component.scss']
})
export class IndicadorDeMusculoComponent implements OnInit {
  @Input() medida: IMedidaDeMusculo;
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
      this.classificacao = this.balanca.classificaMusculo(this.medida);
    } catch (ex) {
      this.classificacao = CONST_CLASSIFICACAO_INVALIDA;
    }
  }
}
