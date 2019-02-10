import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
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

  googleLogin() {
    this.message = 'Tentando entrar com a conta do Google ...';

    this.authService.googleLogin().then(() =>
      this.setMessage()
    );
  }

  login() {
    this.message = 'Tentando entrar ...';

    this.authService.login(this.username, this.password).subscribe(() =>
      this.setMessage()
    );
  }

  logout() {
    const result = this.authService.logout();

    result.then(() => {
      this.setMessage();
    });
  }

  private setMessage() {
    this.message = 'Você está ' + (this.authService.authenticated ? 'conectado' : 'desconectado');
  }
}

