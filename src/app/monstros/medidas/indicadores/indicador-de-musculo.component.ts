import { Component, OnInit, Input, Output } from '@angular/core';
import { IMedidaDeMusculo, Balanca } from '../medidas.model';
import { CONST_CLASSIFICACAO_INVALIDA } from './indicadores.model';

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
    try {
      this.classificacao = this.balanca.classificaMusculo(this.medida);
    } catch (ex) {
      this.classificacao = CONST_CLASSIFICACAO_INVALIDA;
    }
  }
}
