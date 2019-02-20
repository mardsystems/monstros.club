import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  IMedidaDeGordura,
  IMedidaDeGorduraVisceral,
  IMedidaDeIndiceDeMassaCorporal,
  IMedidaDeMusculo,
  Medida,
  SolicitacaoDeCadastroDeMedida
} from '../medidas.model';
import { MedidasService } from '../medidas.service';
import { Monstro } from '../../monstros.model';

@Component({
  selector: 'monstros-medidas-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  dialogTitle = 'Nova Medida';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeMedidaViewModel,
    private dialogRef: MatDialogRef<CadastroComponent>,
    private medidasService: MedidasService
  ) { }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Medida';
    }
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.medidasService.atualizaMedida(this.model.id, this.model)
        : this.medidasService.cadastraMedida(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}

export class CadastroDeMedidaViewModel extends SolicitacaoDeCadastroDeMedida
  implements IMedidaDeGordura, IMedidaDeGorduraVisceral, IMedidaDeMusculo, IMedidaDeIndiceDeMassaCorporal {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.
  monstro: Monstro;

  static toAddViewModel(monstro: Monstro): CadastroDeMedidaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeMedida.toAdd(monstro.id);

    return {
      isEdit: false,
      id: null,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
      feitaCom: solicitacao.feitaCom,
      peso: solicitacao.peso,
      gordura: solicitacao.gordura,
      gorduraVisceral: solicitacao.gorduraVisceral,
      musculo: solicitacao.musculo,
      idadeCorporal: solicitacao.idadeCorporal,
      metabolismoBasal: solicitacao.metabolismoBasal,
      indiceDeMassaCorporal: solicitacao.indiceDeMassaCorporal
    };
  }

  static toEditViewModel(monstro: Monstro, medida: Medida): CadastroDeMedidaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeMedida.toEdit(medida);

    return {
      isEdit: true,
      id: medida.id,
      monstro: monstro,
      monstroId: solicitacao.monstroId,
      data: solicitacao.data,
      feitaCom: solicitacao.feitaCom,
      peso: solicitacao.peso,
      gordura: solicitacao.gordura,
      gorduraVisceral: solicitacao.gorduraVisceral,
      musculo: solicitacao.musculo,
      idadeCorporal: solicitacao.idadeCorporal,
      metabolismoBasal: solicitacao.metabolismoBasal,
      indiceDeMassaCorporal: solicitacao.indiceDeMassaCorporal
    };
  }
}
