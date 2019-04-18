import { InjectionToken } from '@angular/core';
import { Repository } from 'src/app/@app-domain.model';

export class Academia {
  public constructor(
    private _id: string,
    private _nome: string,
    private _logoURL: string,
  ) {

  }

  public get id() { return this._id; }

  public get nome() { return this._nome; }

  public get logoURL() { return this._logoURL; }

  public defineNome(nome: string) {
    this._nome = nome;
  }

  public definelogoURL(logoURL: string) {
    this._logoURL = logoURL;
  }
}

export interface RepositorioDeAcademias extends Repository {
  obtemAcademia(id: string): Promise<Academia>;

  add(academia: Academia): Promise<void>;

  update(academia: Academia): Promise<void>;

  remove(academia: Academia): Promise<void>;
}

export const REPOSITORIO_DE_ACADEMIAS = new InjectionToken<RepositorioDeAcademias>('REPOSITORIO_DE_ACADEMIAS');
