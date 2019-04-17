import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { ConsultaDeAcademias, CONSULTA_DE_ACADEMIAS } from '../academias/academias-@application.model';
import { Academia } from '../academias/@academias-domain.model';
import { ConsultaDeExercicios, CONSULTA_DE_EXERCICIOS } from '../exercicios/@exercicios-application.model';
import { Exercicio } from '../exercicios/@exercicios-domain.model';
import { CadastroDeAparelhos, CADASTRO_DE_APARELHOS } from './@aparelhos-cadastro-application.model';
import { CadastroDeAparelhoViewModel } from './@aparelhos-cadastro-presentation.model';

@Component({
  selector: 'aparelhos-cadastro',
  templateUrl: './aparelhos-cadastro.component.html',
  styleUrls: ['./aparelhos-cadastro.component.scss']
})
export class AparelhosCadastroComponent implements OnInit {
  dialogTitle = 'Novo Aparelho';

  academias$: Observable<Academia[]>;

  exercicios$: Observable<Exercicio[]>;

  cadastroForm = this.formBuilder.group({
    codigo: [this.model.codigo],
    academiaId: [this.model.academiaId],
    exerciciosIds: [this.model.exerciciosIds],
    imagemURL: [this.model.imagemURL],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public model: CadastroDeAparelhoViewModel,
    private dialogRef: MatDialogRef<AparelhosCadastroComponent>,
    @Inject(CADASTRO_DE_APARELHOS)
    private cadastroDeAparelhos: CadastroDeAparelhos,
    @Inject(CONSULTA_DE_ACADEMIAS)
    private consultaDeAcademias: ConsultaDeAcademias,
    @Inject(CONSULTA_DE_EXERCICIOS)
    private consultaDeExercicios: ConsultaDeExercicios,
    private formBuilder: FormBuilder,
  ) {
    this.academias$ = this.consultaDeAcademias.obtemAcademiasParaAdministracao(); // TODO: Exibição.

    this.exercicios$ = this.consultaDeExercicios.obtemExerciciosParaAdministracao(); // TODO: Exibição.
  }

  ngOnInit(): void {
    if (this.model.isEdit) {
      this.dialogTitle = 'Atualiza Aparelho';
    }
  }

  onSave(): void {
    this.model.codigo = this.cadastroForm.value.codigo;

    this.model.academiaId = this.cadastroForm.value.academiaId;

    this.model.exerciciosIds = this.cadastroForm.value.exerciciosIds;

    this.model.imagemURL = this.cadastroForm.value.imagemURL;

    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.cadastroDeAparelhos.atualizaAparelho(this.model.id, this.model)
        : this.cadastroDeAparelhos.cadastraAparelho(this.model);

    operation.then(() => {
      this.dialogRef.close();
    });
  }
}
