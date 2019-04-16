import { HttpClient } from '@angular/common/http';
import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { CalculoDeIdade } from './app-@domain.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor() { }

  debug(message?: any, ...optionalParams: any[]): void {
    console.log(message, optionalParams);
  }
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Erro ao pegar dados do localStorage.', e);
      return null;
    }
  }
  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar no localStorage.', e);
    }
  }
}

export class AtualizacaoDisponivel {
  versaoAtual: string;
  versaoDisponivel: string;
}

export class AtualizacaoAtivada {
  versaoAnterior: string;
  versaoAtual: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogUpdateService {
  public atualizacaoDisponivel$: Observable<AtualizacaoDisponivel>;
  public atualizacaoAtivada$: Observable<AtualizacaoAtivada>;

  constructor(
    updates: SwUpdate,
    private http: HttpClient
  ) {
    // this.getJSON().subscribe(data => {
    //   console.log(data);
    // });

    this.atualizacaoDisponivel$ = updates.available.pipe(
      map(update => {
        const currentAppData = update.current.appData as any;

        const availableAppData = update.available.appData as any;

        const atualizacaoDisponivel: AtualizacaoDisponivel = {
          versaoAtual: currentAppData.version,
          versaoDisponivel: availableAppData.version
        };

        return atualizacaoDisponivel;
      })
    );

    this.atualizacaoAtivada$ = updates.activated.pipe(
      map(update => {
        const previousAppData = update.previous.appData as any;

        const currentAppData = update.current.appData as any;

        const atualizacaoAtivada: AtualizacaoAtivada = {
          versaoAnterior: previousAppData.version,
          versaoAtual: currentAppData.version
        };

        return atualizacaoAtivada;
      })
    );

    // updates.available.subscribe(event => {
    //   console.log('current version is', event.current);
    //   console.log('available version is', event.available);
    // });
    // updates.activated.subscribe(event => {
    //   console.log('old version was', event.previous);
    //   console.log('new version is', event.current);
    // });
  }

  public getJSON(): Observable<any> {
    return this.http.get('ngsw-config.json');
  }
}

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdateService {

  constructor(appRef: ApplicationRef, updates: SwUpdate) {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(() => updates.checkForUpdate());
  }
}

@Injectable({
  providedIn: 'root'
})
export class PromptUpdateService {

  constructor(updates: SwUpdate) {
    updates.available.subscribe(event => {
      if (this.promptUser(event)) {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });
  }

  private promptUser($event): boolean {
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CalculoDeIdade implements CalculoDeIdade {
  calculaIdade(data: Date, dataFim?: Date): number {
    if (!dataFim) {
      const now = new Date(Date.now());

      dataFim = now;
    }

    const calculateYear = dataFim.getFullYear();
    const calculateMonth = dataFim.getMonth();
    const calculateDay = dataFim.getDate();

    const birthYear = data.getFullYear();
    const birthMonth = data.getMonth();
    const birthDay = data.getDate();

    let age = calculateYear - birthYear;
    const ageMonth = calculateMonth - birthMonth;
    const ageDay = calculateDay - birthDay;

    if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
      age = age - 1;
    }

    return age;
  }
}
