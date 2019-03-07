import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'posicao-no-ranking',
  templateUrl: './posicao.component.html',
  styleUrls: ['./posicao.component.scss']
})
export class PosicaoComponent implements OnInit {
  @Input() posicao: number;

  constructor() { }

  ngOnInit() {
  }
}
