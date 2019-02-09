import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  IMedidaDeGordura,
  IMedidaDeGorduraVisceral,
  IMedidaDeIndiceDeMassaCorporal,
  IMedidaDeMusculo,
  Medida,
  SolicitacaoDeCadastroDeMedida
} from './medidas.model';
import { MedidasService } from './medidas.service';
import { Monstro } from '../monstros.model';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.scss']
})
export class MedidaComponent implements OnInit {
  dialogTitle = 'Nova Medida';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: MedidaViewModel,
    private dialogRef: MatDialogRef<MedidaComponent>,
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

export class MedidaViewModel extends SolicitacaoDeCadastroDeMedida
  implements IMedidaDeGordura, IMedidaDeGorduraVisceral, IMedidaDeMusculo, IMedidaDeIndiceDeMassaCorporal {
  isEdit: boolean;
  id?: string; // Usado apenas na edição.
  idade?: number;
  genero?: string;
  monstro: Monstro;

  static toAddViewModel(monstro: Monstro, idade: number, genero: string): MedidaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeMedida.toAdd(monstro.id, idade, genero);

    return {
      isEdit: false,
      id: null,
      idade: idade,
      genero: genero,
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

  static toEditViewModel(monstro: Monstro, medida: Medida, idade: number, genero: string): MedidaViewModel {
    const solicitacao = SolicitacaoDeCadastroDeMedida.toEdit(medida);

    return {
      isEdit: true,
      id: medida.id,
      idade: idade,
      genero: genero,
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
