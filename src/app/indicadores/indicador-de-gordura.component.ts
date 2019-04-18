import { Component, Input, OnInit, Output } from '@angular/core';
import { Balanca, CONST_CLASSIFICACAO_INVALIDA, IMedidaDeGordura } from '../monstros/medidas/@medidas-domain.model';
// import { CONST_CLASSIFICACAO_INVALIDA } from './indicadores.model';

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
    this.executaClassificacao();
  }

  public change(e) {
    this.executaClassificacao();
  }

  private executaClassificacao() {
    try {
      this.classificacao = this.balanca.classificaGordura(this.medida);
    } catch (ex) {
      this.classificacao = CONST_CLASSIFICACAO_INVALIDA;
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   const x = changes;

  //   this.executaClassificacao();

  //   // this.doSomething(changes.categoryId.currentValue);

  //   // You can also use categoryId.previousValue and
  //   // categoryId.firstChange for comparing old and new values
  // }
}
