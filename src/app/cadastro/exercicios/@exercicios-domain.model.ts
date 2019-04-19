import { InjectionToken } from '@angular/core';
import { Repository } from 'src/app/common/domain.model';

export class Exercicio {
  public constructor(
    private _id: string,  // ExercicioId
    private _codigo: string,
    private _nome: string,
    private _musculatura: Musculatura,
    private _imagemURL: string,
  ) {

  }

  public get id() { return this._id; }

  public get codigo() { return this._codigo; }

  public get nome() { return this._nome; }

  public get musculatura() { return this._musculatura; }

  public get imagemURL() { return this._imagemURL; }

  public ajustaCodigo(codigo: string) {
    this._codigo = codigo;
  }

  public corrigeNome(nome: string) {
    this._nome = nome;
  }

  public corrigeMusculatura(musculatura: Musculatura) {
    this._musculatura = musculatura;
  }

  public alteraImagemURL(imagemURL: string) {
    this._imagemURL = imagemURL;
  }
}

export enum Musculatura {
  Dorsais = 'Dorsais',
  Biceps = 'Bíceps',
  Triceps = 'Tríceps',
  Peitorais = 'Peitorais',
  MembrosInferiores = 'Membros Inferiores',
  Ombros = 'Ombros',
  AbdomenLombar = 'Abdômen/Lombar',
}

export interface RepositorioDeExercicios extends Repository {
  obtemExercicio(id: string): Promise<Exercicio>;

  add(exercicio: Exercicio): Promise<void>;

  update(exercicio: Exercicio): Promise<void>;

  remove(exercicio: Exercicio): Promise<void>;
}

export const REPOSITORIO_DE_EXERCICIOS = new InjectionToken<RepositorioDeExercicios>('REPOSITORIO_DE_EXERCICIOS');
