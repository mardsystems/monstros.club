import { Inject } from '@angular/core';
import { IRepositorioDeMonstros, RepositorioDeMonstros } from 'src/app/cadastro/monstros/monstros.domain-model';
import { IRepositorioDeMedidas, Medida, RepositorioDeMedidas } from '../medidas/medidas.domain-model';
import { SolicitacaoDeCadastroDeMedida } from './medidas-cadastro.application-model';
import { UNIT_OF_WORK, UnitOfWork } from 'src/app/app-common.model';

export class MedidasCadastroService {
  constructor(
    @Inject(UNIT_OF_WORK)
    private unitOfWork: UnitOfWork,
    @Inject(RepositorioDeMedidas)
    private repositorioDeMedidas: IRepositorioDeMedidas,
    @Inject(RepositorioDeMonstros)
    private repositorioDeMonstros: IRepositorioDeMonstros,
  ) { }

  async cadastraMedida(solicitacao: SolicitacaoDeCadastroDeMedida): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const medidaId = this.repositorioDeMedidas.createId();

      const monstro = await this.repositorioDeMonstros.obtemMonstro(solicitacao.monstroId);

      //

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

      //

      await this.repositorioDeMedidas.add(medida);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async atualizaMedida(medidaId: string, solicitacao: SolicitacaoDeCadastroDeMedida): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const medida = await this.repositorioDeMedidas.obtemMedida(medidaId);

      //

      medida.defineData(solicitacao.data.toDate());

      medida.defineTipoDeBalanca(solicitacao.feitaCom);

      medida.definePeso(solicitacao.peso);

      medida.defineGordura(solicitacao.gordura);

      medida.defineGorduraVisceral(solicitacao.gorduraVisceral);

      medida.defineMusculo(solicitacao.musculo);

      medida.defineIdadeCorporal(solicitacao.idadeCorporal);

      medida.defineMetabolismoBasal(solicitacao.metabolismoBasal);

      medida.defineIndiceDeMassaCorporal(solicitacao.indiceDeMassaCorporal);

      //

      await this.repositorioDeMedidas.update(medida);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }

  async excluiMedida(medidaId: string): Promise<void> {
    this.unitOfWork.beginTransaction();

    try {
      const medida = await this.repositorioDeMedidas.obtemMedida(medidaId);

      //

      await this.repositorioDeMedidas.remove(medida);

      //

      await this.unitOfWork.commit();
    } catch (e) {
      await this.unitOfWork.rollback();

      throw e;
    }
  }
}
