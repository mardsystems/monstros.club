import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { LogService } from 'src/app/app-common.services';
import { Exercicio, Musculatura } from './exercicios.domain-model';
import { SolicitacaoDeCadastroDeExercicio } from './cadastro/cadastro.application-model';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ExerciciosService {
  PATH = '/exercicios';

  constructor(
    private db: AngularFirestore,
    private log: LogService
  ) { }

  obtemExerciciosObservaveisParaAdministracao(): Observable<Exercicio[]> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH, reference => {
      return reference
        .orderBy('nome', 'asc');
    });

    const exercicios$ = collection.valueChanges().pipe(
      map(values => {
        const exercicios = values
          .map((value) => {
            const exercicio = this.mapExercicio(value);

            return exercicio;
          });

        return exercicios;
      })
    );

    return exercicios$;
  }

  obtemExercicioObservavel(id: string): Observable<Exercicio> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH);

    const document = collection.doc<ExercicioDocument>(id);

    const exercicio$ = document.valueChanges().pipe(
      map(value => {
        return this.mapExercicio(value);
      })
    );

    return exercicio$;
  }

  private mapExercicio(value: ExercicioDocument): Exercicio {
    return new Exercicio(
      value.id,
      value.nome,
      value.musculatura as Musculatura,
      value.imagemURL,
    );
  }

  cadastraExercicio(solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const exercicioId = this.db.createId();

      const exercicio = new Exercicio(
        exercicioId,
        solicitacao.nome,
        solicitacao.musculatura,
        solicitacao.imagemURL,
      );

      const result = this.add(exercicio);

      resolve(result);
    });
  }

  private add(exercicio: Exercicio): Promise<void> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH);

    const document = collection.doc<ExercicioDocument>(exercicio.id);

    const doc = this.mapTo(exercicio);

    const result = document.set(doc);

    return result;
  }

  atualizaExercicio(exercicioId: string, solicitacao: SolicitacaoDeCadastroDeExercicio): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.obtemExercicioObservavel(exercicioId).pipe(
        first()
      ).subscribe(exercicio => {
        exercicio.corrigeNome(solicitacao.nome);

        exercicio.corrigeMusculatura(solicitacao.musculatura);

        exercicio.alteraImagemURL(solicitacao.imagemURL);

        const result = this.update(exercicio);

        resolve(result);
      });
    });
  }

  private update(exercicio: Exercicio): Promise<void> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH);

    const document = collection.doc<ExercicioDocument>(exercicio.id);

    const doc = this.mapTo(exercicio);

    const result = document.update(doc);

    return result;
  }

  private mapTo(exercicio: Exercicio): ExercicioDocument {
    const doc: ExercicioDocument = {
      id: exercicio.id,
      nome: exercicio.nome,
      musculatura: exercicio.musculatura,
      imagemURL: exercicio.imagemURL,
    };

    return doc;
  }

  excluiExercicio(exercicioId: string): Promise<void> {
    const collection = this.db.collection<ExercicioDocument>(this.PATH);

    const document = collection.doc<ExercicioDocument>(exercicioId);

    const result = document.delete();

    return result;
  }
}

interface ExercicioDocument {
  id: string;
  nome: string;
  musculatura: string;
  imagemURL: string;
}
