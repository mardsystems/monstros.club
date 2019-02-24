import { Component, Inject, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { MedidasService } from '../medidas.service';
import { CadastroDeMedidaViewModel } from './cadastro.presentation-model';
import { Balanca, TipoDeBalanca, OmronHBF214, BalancaComum } from '../medidas.domain-model';

@Component({
  selector: 'monstros-medidas-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit, OnChanges {
  dialogTitle = 'Nova Medida';
  balanca: Balanca;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeMedidaViewModel,
    private dialogRef: MatDialogRef<CadastroComponent>,
    private medidasService: MedidasService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.balanca = new OmronHBF214();
  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Medida';
    }
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
        ? this.medidasService.atualizaMedida(this.model.id, this.model)
        : this.medidasService.cadastraMedida(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
