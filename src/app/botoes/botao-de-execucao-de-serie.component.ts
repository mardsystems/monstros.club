import { Component, Input, OnInit } from '@angular/core';
import { ExecucaoDeSerie } from '../monstros/series/execucoes/@execucoes-domain.model';

@Component({
  selector: 'botao-de-execucao-de-serie',
  templateUrl: './botao-de-execucao-de-serie.component.html',
  styleUrls: ['./botao-de-execucao-de-serie.component.scss']
})
export class BotaoDeExecucaoDeSerieComponent implements OnInit {
  @Input() execucao: ExecucaoDeSerie;

  @Input() cor: string;

  constructor() { }

  ngOnInit() {
  }

}
