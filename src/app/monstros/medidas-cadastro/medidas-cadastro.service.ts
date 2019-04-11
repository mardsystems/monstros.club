import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { Medida } from '../medidas/medidas.domain-model';
import { MedidasService } from '../medidas/medidas.service';
import { MonstrosService } from '../monstros.service';
import { SolicitacaoDeCadastroDeMedida } from './medidas-cadastro.application-model';

@Injectable({
  providedIn: 'root'
})
export class MedidasCadastroService {
  constructor(
    private repositorioDeMonstros: MonstrosService,
    private repositorioDeMedidas: MedidasService,
  ) { }

  cadastraMedida(solicitacao: SolicitacaoDeCadastroDeMedida): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeMonstros.obtemMonstroObservavel(solicitacao.monstroId).pipe(
        first()
      ).subscribe(monstro => {
        const medidaId = this.repositorioDeMedidas.createId();

        const medida = new Medida(
          medidaId,
          monstro,
          solicitacao.monstroId,
          solicitacao.data.toDate(),
          solicitacao.feitaCom,
          solicitacao.peso,
          solicitacao.gordura,
          solicitacao.gorduraVisceral,
          solicitacao.musculo,
          solicitacao.idadeCorporal,
          solicitacao.metabolismoBasal,
          solicitacao.indiceDeMassaCorporal
        );

        const result = this.repositorioDeMedidas.add(medida);

        resolve(result);
      });
    });
  }

  atualizaMedida(medidaId: string, solicitacao: SolicitacaoDeCadastroDeMedida): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.repositorioDeMedidas.obtemMedidaObservavel(medidaId).pipe(
        first()
      ).subscribe(medida => {
        medida.defineData(solicitacao.data.toDate());

        medida.defineTipoDeBalanca(solicitacao.feitaCom);

        medida.definePeso(solicitacao.peso);

        medida.defineGordura(solicitacao.gordura);

        medida.defineGorduraVisceral(solicitacao.gorduraVisceral);

        medida.defineMusculo(solicitacao.musculo);

        medida.defineIdadeCorporal(solicitacao.idadeCorporal);

        medida.defineMetabolismoBasal(solicitacao.metabolismoBasal);

        medida.defineIndiceDeMassaCorporal(solicitacao.indiceDeMassaCorporal);

        const result = this.repositorioDeMedidas.update(medida);

        resolve(result);
      });
    });
  }

  async excluiMedida(medidaId: string): Promise<void> {
    return await this.repositorioDeMedidas.remove(medidaId);
  }
}
