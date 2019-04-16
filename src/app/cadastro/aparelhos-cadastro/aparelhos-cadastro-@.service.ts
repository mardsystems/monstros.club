import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { AcademiasService } from '../academias/academias.service';
import { Aparelho } from '../aparelhos/aparelhos-@domain.model';
import { AparelhosService } from '../aparelhos/aparelhos-@firebase.service';
import { Exercicio } from '../exercicios/exercicios.domain-model';
import { ExerciciosService } from '../exercicios/exercicios.service';
import { SolicitacaoDeCadastroDeAparelho } from './aparelhos-cadastro-@application.model';

@Injectable({
  providedIn: 'root'
})
export class AparelhosCadastroService {
  constructor(
    private repositorioDeAparelhos: AparelhosService,
    private repositorioDeAcademias: AcademiasService,
    private repositorioDeExercicios: ExerciciosService,
  ) { }

  cadastraAparelho(solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeAcademias.obtemAcademiaObservavel(solicitacao.academia).pipe(
        first()
      ).subscribe(solicitacao_academia => {
        let exercicios$: Observable<Exercicio[]>;

        if (solicitacao.exercicios.length === 0) {
          exercicios$ = of([]);
        } else {
          exercicios$ = combineLatest(
            solicitacao.exercicios.map(exercicio =>
              this.repositorioDeExercicios.obtemExercicioObservavel(exercicio).pipe(
                first()
              )
            )
          ).pipe(
            first()
          );
        }

        exercicios$.pipe(
          first()
        ).subscribe(solicitacao_exercicios => {
          const aparelhoId = this.repositorioDeAparelhos.createId();

          const aparelho = new Aparelho(
            aparelhoId,
            solicitacao.codigo,
            solicitacao_academia,
            solicitacao_exercicios,
            solicitacao.imagemURL,
          );

          const result = this.repositorioDeAparelhos.add(aparelho);

          resolve(result);
        });
      });
    });
  }

  atualizaAparelho(aparelhoId: string, solicitacao: SolicitacaoDeCadastroDeAparelho): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeAcademias.obtemAcademiaObservavel(solicitacao.academia).pipe(
        first()
      ).subscribe(solicitacao_academia => {
        let exercicios$: Observable<Exercicio[]>;

        if (solicitacao.exercicios.length === 0) {
          exercicios$ = of([]);
        } else {
          exercicios$ = combineLatest(
            solicitacao.exercicios.map(exercicio =>
              this.repositorioDeExercicios.obtemExercicioObservavel(exercicio).pipe(
                first()
              )
            )
          ).pipe(
            first()
          );
        }

        exercicios$.pipe(
          first()
        ).subscribe(solicitacao_exercicios => {
          this.repositorioDeAparelhos.obtemAparelhoObservavel(aparelhoId).pipe(
            first()
          ).subscribe(aparelho => {
            aparelho.alteraCodigo(solicitacao.codigo);

            aparelho.corrigeAcademia(solicitacao_academia);

            aparelho.alteraExercicios(solicitacao_exercicios);

            aparelho.alteraImagemURL(solicitacao.imagemURL);

            const result = this.repositorioDeAparelhos.update(aparelho);

            resolve(result);
          });
        });
      });
    });
  }

  async excluiAparelho(aparelhoId: string): Promise<void> {
    return await this.repositorioDeAparelhos.remove(aparelhoId);
  }
}
