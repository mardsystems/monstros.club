import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DbContext } from './common/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class MonstrosDbContext extends DbContext {
  constructor(
    readonly firebase: AngularFirestore,
  ) {
    super(firebase);
  }

  academiasPath(): string {
    return '/academias';
  }

  aparelhosPath(): string {
    return '/aparelhos';
  }

  exerciciosPath(): string {
    return '/exercicios';
  }

  medidasPath(): string {
    return '/medidas';
  }

  rankingsPath(): string {
    return '/rankings';
  }

  monstrosPath(): string {
    return '/monstros';
  }

  seriesPath(monstroId: string): string {
    return `/monstros/${monstroId}/series`;
  }

  execucoesDeSeriePath(monstroId: string, serieId: string): string {
    return `/monstros/${monstroId}/series/${serieId}/execucoes`;
  }

  // seriesPath(monstroId: string, serieId?: string): string {
  //   if (serieId) {
  //     return `/monstros/${monstroId}/series/${serieId}`;
  //   } else {
  //     return `/monstros/${monstroId}/series`;
  //   }
  // }

  // seriesPath(monstroId: string, serieId?: string, execucaoId?: string): string {
  //   if (execucaoId) {
  //     if (serieId) {
  //       return `/monstros/${monstroId}/series/${serieId}/execucoes/${execucaoId}`;
  //     } else {
  //       return `/monstros/${monstroId}/series`;
  //     }
  //   } else {
  //     if (serieId) {
  //       return `/monstros/${monstroId}/series/${serieId}`;
  //     } else {
  //       return `/monstros/${monstroId}/series`;
  //     }
  //   }
  // }
}
