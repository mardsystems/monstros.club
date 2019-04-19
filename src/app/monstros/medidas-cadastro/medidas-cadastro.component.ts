import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MatSelectChange, MAT_DIALOG_DATA } from '@angular/material';
import { CalculoDeIdade, CALCULO_DE_IDADE } from 'src/app/common/domain.model';
import { Balanca, BalancaComum, OmronHBF214, TipoDeBalanca } from '../medidas/@medidas-domain.model';
import { CadastroDeMedidas, CADASTRO_DE_MEDIDAS } from './@medidas-cadastro-application.model';
import { CadastroDeMedidaViewModel } from './@medidas-cadastro-presentation.model';

@Component({
  selector: 'medidas-cadastro',
  templateUrl: './medidas-cadastro.component.html',
  styleUrls: ['./medidas-cadastro.component.scss']
})
export class MedidasCadastroComponent implements OnInit, OnChanges {
  dialogTitle = 'Nova Medida';
  balanca: Balanca;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeMedidaViewModel,
    private dialogRef: MatDialogRef<MedidasCadastroComponent>,
    @Inject(CADASTRO_DE_MEDIDAS)
    private cadastroDeMedidas: CadastroDeMedidas,
    @Inject(CALCULO_DE_IDADE)
    private calculoDeIdade: CalculoDeIdade,
  ) {
    this.balanca = new OmronHBF214();
  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Medida';
    }
  }

  public get idade(): Number {
    if (!this.model.monstro.dataDeNascimento) {
      return 0;
    }

    const idade = this.calculoDeIdade.calculaIdade(this.model.monstro.dataDeNascimento, this.model.data.toDate());

    return idade;
  }

  ngOnChanges(changes: SimpleChanges) {
    const x = changes;

    // this.doSomething(changes.categoryId.currentValue);

    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
  }

  feitaCom_selectionChange(e: MatSelectChange): void {
    switch (e.value) {
      case TipoDeBalanca.BalancaComum:
        this.balanca = new BalancaComum();

        break;

      case TipoDeBalanca.OmronHBF214:
        this.balanca = new OmronHBF214();

        break;

      default:
        this.balanca = null;

        break;

    }
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.cadastroDeMedidas.atualizaMedida(this.model.id, this.model)
        : this.cadastroDeMedidas.cadastraMedida(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
