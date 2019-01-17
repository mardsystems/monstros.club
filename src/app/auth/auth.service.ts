import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, UserInfo } from 'firebase/app';
import { concat, Observable, of, Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string;
  userInfo$: Observable<UserInfo>;
  localUser$: Subject<UserInfo>;

  constructor(
    private angularFireAuth: AngularFireAuth
  ) {
    this.localUser$ = new Subject<UserInfo>();

    this.userInfo$ = concat(this.angularFireAuth.authState, this.localUser$);

    this.userInfo$.subscribe(userInfo => console.log(userInfo));
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();

    return this.angularFireAuth.auth.signInWithPopup(provider)
      .then((userCredential) => {
        this.isLoggedIn = true;
      });
  }

  signOut() {
    this.angularFireAuth.auth.signOut().then(() => {
      this.isLoggedIn = false;
    });
  }

  login(user: string, password: string): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => {
        if (user === 'marcelo' && password === 'admin') {
          this.isLoggedIn = true;

          const userInfo: UserInfo = {
            displayName: 'Marcelo (Local)',
            email: 'marcelo@monstros.club',
            phoneNumber: '99593-2302',
            photoURL: 'https://monstros.club/foto-vQeCUnaAWmzr2YxP5wB1.ea793278ed2597e1d1a8.jpg',
            providerId: 'local',
            uid: 'vQeCUnaAWmzr2YxP5wB1',
          };

          this.localUser$.next(userInfo);
        }
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;

    this.localUser$.next(null);
  }
}
