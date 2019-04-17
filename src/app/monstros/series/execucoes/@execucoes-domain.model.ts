import * as _ from 'lodash';
import { Tempo } from 'src/app/app-@domain.model';
import { Academia } from 'src/app/cadastro/academias/@academias-domain.model';
import { Aparelho, RepositorioDeAparelhos } from 'src/app/cadastro/aparelhos/aparelhos-@domain.model';
import { Serie, SerieDeExercicio } from '../series-@domain.model';

export class ExecucaoDeSerie {
  private _exercicios?: ExecucaoDeExercicio[];

  public constructor(
    private _id: string,
    private _serie: Serie,
    private _dia: Date,
    private _numero: number,
    private _feitaNa?: Academia,
    private _timestamp?: number,
    exercicios?: ExecucaoDeExercicio[],
  ) {
    if (_timestamp) {
      this._exercicios = exercicios;
    } else {
      this._exercicios = [];
    }
  }

  public get id() { return this._id; }

  public get serie() { return this._serie; }

  public get dia() { return this._dia; }

  public get numero() { return this._numero; }

  public get duracao() { return null; }

  public get feitaNa() { return this._feitaNa; }

  public get exercicios() { return this._exercicios; }

  public get timestamp() { return this._timestamp; }

  public corrigeDia(dia: Date) {
    this._dia = dia;
  }

  public alteraNumero(numero: number) {
    this._numero = numero;
  }

  public async prepara(repositorioDeAparelhos: RepositorioDeAparelhos): Promise<void> {
    this._serie.exercicios.forEach(async (exercicio) => {
      const aparelho = await repositorioDeAparelhos.localizaAparelho(exercicio.exercicio, this._feitaNa);

      for (let i = 0; i < exercicio.quantidade; i++) {
        this.adicionaExercicio(exercicio, aparelho);
      }
    });
  }

  public adicionaExercicio(referencia: SerieDeExercicio, feitoCom: Aparelho) {
    const maxById = _.maxBy(this._exercicios, 'id');

    let nextId: number;

    if (maxById === undefined) {
      nextId = 1;
    } else {
      nextId = maxById.id + 1;
    }

    const execucaoDeExercicio = new ExecucaoDeExercicio(
      nextId,
      nextId,
      referencia,
      referencia.repeticoes,
      referencia.carga,
      referencia.nota,
      feitoCom,
      null
    );

    this._exercicios.push(execucaoDeExercicio);
  }

  public obtemExecucaoDeExercicio(id: number): ExecucaoDeExercicio {
    const execucaoDeExercicio = _.find(this._exercicios, { id: id });

    return execucaoDeExercicio;
  }

  public removeExecucaoDeExercicio(id: number) {
    _.remove(this._exercicios, execucaoDeExercicio => execucaoDeExercicio.id === id);
  }
}

export class ExecucaoDeExercicio {
  public constructor(
    private _id: number,
    private _sequencia: number,
    private _referencia: SerieDeExercicio,
    private _repeticoes: number,
    private _carga: number,
    private _nota: string,
    private _feitoCom?: Aparelho,
    private _duracao?: Tempo,
  ) {
    if (!_duracao) {
      this._duracao = new Tempo();
    }
  }

  public get id() { return this._id; }

  public get sequencia() { return this._sequencia; }

  public get referencia() { return this._referencia; }

  public get repeticoes() { return this._repeticoes; }

  public get carga() { return this._carga; }

  public get nota() { return this._nota; }

  public get duracao() { return this._duracao; }

  public get feitoCom() { return this._feitoCom; }

  public alteraSequencia(sequencia: number) {
    this._sequencia = sequencia;
  }

  public ajustaRepeticoes(repeticoes: number) {
    this._repeticoes = repeticoes;
  }

  public ajustaCarga(carga: number) {
    this._carga = carga;
  }

  public atualizaNota(nota: string) {
    this._nota = nota;
  }

  public inicia() {
    const agora = new Date(Date.now());

    this._duracao.inicio = agora;
  }

  public finaliza() {
    const agora = new Date(Date.now());

    this._duracao.fim = agora;
  }
}
