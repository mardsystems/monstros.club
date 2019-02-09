import { Component, OnInit, Input, Output } from '@angular/core';
import { IMedidaDeGorduraVisceral, Balanca } from '../medidas.model';
import { CONST_CLASSIFICACAO_INVALIDA } from './indicadores.model';

@Component({
  selector: 'indicador-de-gordura-visceral',
  templateUrl: './indicador-de-gordura-visceral.component.html',
  styleUrls: ['./indicador-de-gordura-visceral.component.scss']
})
export class IndicadorDeGorduraVisceralComponent implements OnInit {
  @Input() medida: IMedidaDeGorduraVisceral;
  @Input() balanca: Balanca;
  @Output() classificacao: number;

  constructor() {

  }

  ngOnInit() {
    try {
      this.classificacao = this.balanca.classificaGorduraVisceral(this.medida);
    } catch (ex) {
      this.classificacao = CONST_CLASSIFICACAO_INVALIDA;
    }
  }
}
