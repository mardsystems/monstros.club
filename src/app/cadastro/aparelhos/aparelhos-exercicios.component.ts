import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Aparelho } from './aparelhos-@domain.model';
import { AparelhosService } from './aparelhos-@firebase.service';

@Component({
  selector: 'cadastro-de-aparelhos-exercicios',
  templateUrl: './aparelhos-exercicios.component.html',
  styleUrls: ['./aparelhos-exercicios.component.scss']
})
export class AparelhosExerciciosComponent {
  @Input() aparelho: Aparelho;

  constructor(
    private dialog: MatDialog,
    private aparelhosService: AparelhosService
  ) { }
}
