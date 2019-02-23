import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ParticipacaoComponent } from './cadastro/participacao.component';
import { ParticipacaoViewModel } from './cadastro/participacao.presentation-model';
import { Ranking } from './rankings.domain-model';

@Component({
  selector: 'monstros-rankings-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.scss']
})
export class ParticipantesComponent implements OnInit {
  @Input() ranking: Ranking;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  onAdd(): void {
    const model = ParticipacaoViewModel.toViewModel(this.ranking);

    const config: MatDialogConfig<ParticipacaoViewModel> = { data: model };

    this.dialog.open(ParticipacaoComponent, config);
  }
}