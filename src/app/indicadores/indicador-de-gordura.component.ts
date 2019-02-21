import { Component, Input, OnInit, Output } from '@angular/core';
import { Balanca, IMedidaDeGordura } from '../monstros/medidas/medidas.domain-model';
import { CONST_CLASSIFICACAO_INVALIDA } from './indicadores.model';

@Component({
  selector: 'indicador-de-gordura',
  templateUrl: './indicador-de-gordura.component.html',
  styleUrls: ['./indicador-de-gordura.component.scss']
})
export class IndicadorDeGorduraComponent implements OnInit {
  @Input() medida: IMedidaDeGordura;
  @Input() balanca: Balanca;
  @Output() classificacao: number;

  constructor() {

  }

  ngOnInit() {
    try {
      this.classificacao = this.balanca.classificaGordura(this.medida);
    } catch (ex) {
      this.classificacao = CONST_CLASSIFICACAO_INVALIDA;
    }
  }
}
