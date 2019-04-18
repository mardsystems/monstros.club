import { CadastroDeMonstros, SolicitacaoDeCadastroDeMonstro } from './@monstros-cadastro-application.model';
import { MonstrosCadastroService } from './@monstros-cadastro.service';

// const heroServiceFactory = (logger: Logger, userService: UserService) => {
//   return new HeroService(logger, userService.user.isAuthorized);
// };

// export let heroServiceProvider = {
//   provide: HeroService,
//   useFactory: heroServiceFactory,
//   deps: [Logger, UserService]
// };

export class MonstrosCadastroProvider implements CadastroDeMonstros {
  constructor(
    private readonly monstrosCadastroService: MonstrosCadastroService
  ) {

  }

  cadastraMonstro(solicitacao: SolicitacaoDeCadastroDeMonstro): Promise<void> {
    return this.monstrosCadastroService.cadastraMonstro(solicitacao);
  }

  atualizaMonstro(monstroId: string, solicitacao: SolicitacaoDeCadastroDeMonstro): Promise<void> {
    return this.monstrosCadastroService.atualizaMonstro(monstroId, solicitacao);
  }

  excluiMonstro(monstroId: string): Promise<void> {
    return this.monstrosCadastroService.excluiMonstro(monstroId);
  }
}
