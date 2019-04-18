import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Aparelho } from './@aparelhos-domain.model';

@Component({
  selector: 'cadastro-de-aparelhos-exercicios',
  templateUrl: './aparelhos-exercicios.component.html',
  styleUrls: ['./aparelhos-exercicios.component.scss']
})
export class AparelhosExerciciosComponent {
  @Input() aparelho: Aparelho;

  constructor(
    private dialog: MatDialog,
  ) { }
}
