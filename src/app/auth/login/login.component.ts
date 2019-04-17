import { Component } from '@angular/core';
import { AuthService } from '../@auth.service';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  message: string;
  username: string;
  password: string;

  constructor(
    public authService: AuthService
  ) {
    this.setMessage();
  }

  async googleLogin() {
    this.message = 'Tentando entrar com a conta do Google ...';

    try {
      await this.authService.googleLogin();

      this.setMessage();
    } catch (e) {
      this.setErrorMessage(e);
    }
  }

  async login() {
    this.message = 'Tentando entrar ...';

    try {
      await this.authService.login(this.username, this.password);

      this.setMessage();
    } catch (e) {
      this.setErrorMessage(e);
    }
  }

  async logout() {
    try {
      await this.authService.logout();

      this.setMessage();
    } catch (e) {
      this.setErrorMessage(e);
    }
  }

  private setMessage() {
    this.message = 'Você está ' + (this.authService.authenticated ? 'conectado' : 'desconectado');
  }

  private setErrorMessage(e: Error) {
    this.message = 'Erro: ' + e.message;
  }
}

