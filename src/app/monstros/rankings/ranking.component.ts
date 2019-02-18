import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Monstro } from '../monstros.model';
import { Ranking, SolicitacaoDeCadastroDeRanking } from './rankings.model';
import { RankingsService } from './rankings.service';

@Component({
  selector: 'monstros-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {
  dialogTitle = 'Novo Ranking';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: RankingViewModel,
    private dialogRef: MatDialogRef<RankingComponent>,
    private medidasService: RankingsService
  ) { }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Ranking';
    }
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.medidasService.atualizaRanking(this.model.id, this.model)
        : this.medidasService.cadastraRanking(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}

export class RankingViewModel extends SolicitacaoDeCadastroDeRanking {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.
  proprietario: Monstro;

  static toAddViewModel(proprietario: Monstro): RankingViewModel {
    const solicitacao = SolicitacaoDeCadastroDeRanking.toAdd(proprietario.id);

    return {
      isEdit: false,
      id: null,
      nome: solicitacao.nome,
      proprietario: proprietario,
      proprietarioId: solicitacao.proprietarioId,
      dataDeCriacao: solicitacao.dataDeCriacao,
      feitoCom: solicitacao.feitoCom,
    };
  }

  static toEditViewModel(proprietario: Monstro, ranking: Ranking): RankingViewModel {
    const solicitacao = SolicitacaoDeCadastroDeRanking.toEdit(ranking);

    return {
      isEdit: true,
      id: ranking.id,
      nome: solicitacao.nome,
      proprietario: proprietario,
      proprietarioId: solicitacao.proprietarioId,
      dataDeCriacao: solicitacao.dataDeCriacao,
      feitoCom: solicitacao.feitoCom,
    };
  }
}
