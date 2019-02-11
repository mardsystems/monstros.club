import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { first, switchMap, map, catchError } from 'rxjs/operators';
import { CalculoDeIdade } from '../app.services';
import { AuthService } from '../auth/auth.service';
import { SolicitacaoDeCadastroDeMonstro } from './monstros.model';
import { MonstrosService } from './monstros.service';
import { merge, of } from 'rxjs';

@Component({
  selector: 'app-monstro-perfil',
  templateUrl: './monstro-perfil.component.html',
  styleUrls: ['./monstro-perfil.component.scss']
})
export class MonstroPerfilComponent implements OnInit {
  loading = true;
  disabledUpdate: boolean;
  public model: SolicitacaoDeCadastroDeMonstro = {
    isEdit: false
  };

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private monstrosService: MonstrosService,
    private calculoDeIdade: CalculoDeIdade
  ) { }

  ngOnInit() {
    const monstro$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const monstroId = params.get('monstroId');

        return this.monstrosService.obtemMonstroObservavel(monstroId);
      }),
      catchError((error, monstro) => {
        console.log(error);

        return of(null);
      })
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
