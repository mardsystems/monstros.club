import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(user: string, password: string): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => {
        if (user === 'admin' && password === 'admin') {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}
