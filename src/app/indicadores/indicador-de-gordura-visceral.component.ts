import { Component, Input, OnInit, Output } from '@angular/core';
import { Balanca, CONST_CLASSIFICACAO_INVALIDA, IMedidaDeGorduraVisceral } from '../monstros/medidas/@medidas-domain.model';
// import { CONST_CLASSIFICACAO_INVALIDA } from './indicadores.model';

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
    this.executaClassificacao();
  }

  public change(e) {
    this.executaClassificacao();
  }

  private executaClassificacao() {
    try {
      this.classificacao = this.balanca.classificaGorduraVisceral(this.medida);
    } catch (ex) {
      this.classificacao = CONST_CLASSIFICACAO_INVALIDA;
    }
  }
}
