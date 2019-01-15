import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

interface User {
  uid?: string;
  id?: string;
  nome?: string;
  altura?: number;
  genero?: string;
  dataDeNascimento?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<User>;

  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(monstro => {
        if (monstro) {
          return this.db.doc<User>(`monstros/${monstro.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();

    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.isLoggedIn = true;

        this.updateUserData(credential.user);
      });
  }

  // public get foto(): string {
  //   if (true) {
  //     return `../assets/foto-${this.monstroId.replace('monstros/', '')}.jpg`;
  //   } else {

  //   }
  // }

  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.db.doc(`monstros/${user.uid}`);

    const data: User = {
      // uid: user.uid,
      id: user.uid,
      // nome: user.email,
      // altura: user.altura,
      // genero: user.genero,
      // dataDeNascimento: user.dataDeNascimento,
      email: user.email,
      // displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true });
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.isLoggedIn = false;

      this.router.navigate(['/']);
    });
  }

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
