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
  isGoogle: boolean;

  constructor(
    public authService: AuthService
  ) {
    this.setMessage();
  }

  googleLogin() {
    this.isGoogle = true;

    this.message = 'Trying to log in Google ...';

    this.authService.signInWithGoogle().then(() =>
      this.setMessage()
    );
  }

  login() {
    this.isGoogle = false;

    this.message = 'Trying to log in ...';

    this.authService.login(this.username, this.password).subscribe(() =>
      this.setMessage()
    );
  }

  logout() {
    if (this.isGoogle) {
      this.authService.signOut();
    } else {
      this.authService.logout();
    }

    this.setMessage();
  }

  private setMessage() {
    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }
}

