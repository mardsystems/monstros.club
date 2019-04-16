import { Component, OnInit } from 'src/app/monstros/perfil/node_modules/@angular/core';
import { ActivatedRoute, ParamMap } from 'src/app/monstros/perfil/node_modules/@angular/router';
import { of, EMPTY } from 'src/app/monstros/perfil/node_modules/rxjs';
import { catchError, first, switchMap, tap, map, shareReplay } from 'src/app/monstros/perfil/node_modules/rxjs/operators';
import { CalculoDeIdade, LogService } from '../../app-@shared.services';
import { AuthService } from '../../auth/auth.service';
import { MonstrosFirecloudRepository } from '../monstros.firecloud-repository';
import { SolicitacaoDeCadastroDeMonstro } from './perfil.application-model';

@Component({
  selector: 'monstros-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  loading = true;
  disabledUpdate: boolean;
  public model: SolicitacaoDeCadastroDeMonstro = {
    isEdit: false
  };

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private monstrosService: MonstrosFirecloudRepository,
    private calculoDeIdade: CalculoDeIdade,
    private log: LogService,
  ) { }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      first(),
      // tap((value) => this.log.debug('CadastroDeMonstrosComponent: paramMap1', value)),
      map(params => params.get('monstroId')),
      // tap((value) => this.log.debug('CadastroDeMonstrosComponent: paramMap2', value)),
      switchMap(monstroId => this.monstrosService.obtemMonstroObservavel(monstroId).pipe(first())),
      catchError((error) => {
        console.log(`Não foi possível montar o perfil do monstro.\nRazão:\n${error}`);

        return EMPTY; // Observable.throw(e);
      }),
      shareReplay()
    );

    monstro$.pipe(
      first()
    ).subscribe(() => {
      this.loading = false;
    });

    monstro$.subscribe(monstro => {
      if (monstro) {
        this.model = SolicitacaoDeCadastroDeMonstro.toEdit(monstro);
      }
    });

    monstro$.pipe(
      first(),
      switchMap(monstro => {
        if (!monstro) {
          return of(false);
        } else {
          return this.monstrosService.ehVoceMesmo(monstro.id);
        }
      }),
      switchMap(value => {
        if (value) {
          return of(true);
        } else {
          return this.monstrosService.ehAdministrador();
        }
      })
    ).subscribe(value => {
      this.disabledUpdate = !value;
    });
  }

  public get idade(): Number {
    if (!this.model.dataDeNascimento) {
      return 0;
    }

    const idade = this.calculoDeIdade.calculaIdade(this.model.dataDeNascimento.toDate());

    return idade;
  }

  onSave(): void {
    const operation: Promise<void> =
      (this.model.isEdit)
        ? this.monstrosService.atualizaMonstro(this.model.id, this.model)
        : this.monstrosService.cadastraMonstro(this.model);

    operation.then(() => {
      // this.dialogRef.close();
    });
  }

  // logout() {
  //   const result = this.authService.logout();

  //   result.then(() => {
  //     // this.router.navigate(['/']);
  //   });
  // }
}
