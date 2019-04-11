import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Academia } from '../academias/academias.domain-model';
import { AcademiasService } from '../academias/academias.service';
import { SolicitacaoDeCadastroDeAcademia } from './academias-cadastro.application-model';

@Injectable({
  providedIn: 'root'
})
export class AcademiasCadastroService {
  constructor(
    private repositorioDeAcademias: AcademiasService,
  ) { }

  cadastraAcademia(solicitacao: SolicitacaoDeCadastroDeAcademia): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const academiaId = this.repositorioDeAcademias.createId();

      const academia = new Academia(
        academiaId,
        solicitacao.nome,
        solicitacao.logoURL,
      );

      const result = this.repositorioDeAcademias.add(academia);

      resolve(result);
    });
  }

  atualizaAcademia(academiaId: string, solicitacao: SolicitacaoDeCadastroDeAcademia): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeAcademias.obtemAcademiaObservavel(academiaId).pipe(
        first()
      ).subscribe(academia => {
        academia.defineNome(solicitacao.nome);

        academia.definelogoURL(solicitacao.logoURL);

        const result = this.repositorioDeAcademias.update(academia);

        resolve(result);
      });
    });
  }

  async excluiAcademia(academiaId: string): Promise<void> {
    return await this.repositorioDeAcademias.remove(academiaId);
  }
}
