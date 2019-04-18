import { Component, Input, OnInit } from '@angular/core';
import { Exercicio } from '../cadastro/exercicios/@exercicios-domain.model';

@Component({
  selector: 'botao-de-exercicio',
  templateUrl: './botao-de-exercicio.component.html',
  styleUrls: ['./botao-de-exercicio.component.scss']
})
export class BotaoDeExercicioComponent implements OnInit {
  @Input() exercicio: Exercicio;

  @Input() cor: string;

  constructor() { }

  ngOnInit() {
  }

}
