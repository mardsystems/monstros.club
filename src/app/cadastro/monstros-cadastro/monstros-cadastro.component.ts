import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { catchError, first, map, shareReplay, switchMap } from 'rxjs/operators';
import { CalculoDeIdade, CALCULO_DE_IDADE } from 'src/app/@app-domain.model';
import { AuthService } from 'src/app/auth/@auth.service';
import { ConsultaDeMonstros, CONSULTA_DE_MONSTROS } from '../monstros/@monstros-application.model';
import { AdaptadorParaUserInfo } from '../monstros/@monstros-integration.model';
import { CadastroDeMonstros, CADASTRO_DE_MONSTROS, SolicitacaoDeCadastroDeMonstro } from './@monstros-cadastro-application.model';

@Component({
  selector: 'monstros-cadastro',
  templateUrl: './monstros-cadastro.component.html',
  styleUrls: ['./monstros-cadastro.component.scss']
})
export class MonstrosCadastroComponent implements OnInit {
  loading = true;
  disabledUpdate: boolean;
  public model: SolicitacaoDeCadastroDeMonstro = {
    isEdit: false
  };

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    @Inject(CADASTRO_DE_MONSTROS)
    private cadastroDeMonstros: CadastroDeMonstros,
    @Inject(CONSULTA_DE_MONSTROS)
    private consultaDeMonstros: ConsultaDeMonstros,
    @Inject(CALCULO_DE_IDADE)
    private calculoDeIdade: CalculoDeIdade,
    private adaptadorParaUserInfo: AdaptadorParaUserInfo,
  ) { }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      first(),
      // tap((value) => this.log.debug('CadastroDeMonstrosComponent: paramMap1', value)),
      map(params => params.get('monstroId')),
      // tap((value) => this.log.debug('CadastroDeMonstrosComponent: paramMap2', value)),
      switchMap(monstroId => this.consultaDeMonstros.obtemMonstroObservavel(monstroId).pipe(first())),
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
          return this.adaptadorParaUserInfo.ehVoceMesmo(monstro.id);
        }
      }),
      switchMap(value => {
        if (value) {
          return of(true);
        } else {
          return this.adaptadorParaUserInfo.ehAdministrador();
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
        ? this.cadastroDeMonstros.atualizaMonstro(this.model.id, this.model)
        : this.cadastroDeMonstros.cadastraMonstro(this.model);

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
