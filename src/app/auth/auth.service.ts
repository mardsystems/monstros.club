import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, UserInfo } from 'firebase/app';
import { merge, Observable, of, Subject } from 'rxjs';
import { delay, tap, first, shareReplay } from 'rxjs/operators';
import { Router, NavigationExtras } from '@angular/router';
import { LogService } from '../app-common.services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // isLoggedIn = false;
  public redirectUrl = '';
  public user$: Observable<UserInfo>;
  private localUser$: Subject<UserInfo>;
  private authState: any = null;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private log: LogService
  ) {
    this.localUser$ = new Subject<UserInfo>();

    this.user$ = this.angularFireAuth.authState; // merge(this.angularFireAuth.authState, this.localUser$);

    this.user$.pipe(
      tap((value) => this.log.debug('AuthService: constructor: authState: ', value)),
    ).subscribe((user) => {
      this.authState = user;
    });
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.angularFireAuth.authState;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false;
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest';
    } else if (this.currentUserAnonymous) {
      return 'Anonymous';
    } else {
      return this.authState['displayName'] || 'User without a Name';
    }
  }

  //// Custom login ////

  login(user: string, password: string): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => {
        if (user === 'marcelo' && password === 'admin') {
          // this.isLoggedIn = true;

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

  //// Social Auth ////

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();

    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();

    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new auth.TwitterAuthProvider();

    return this.socialSignIn(provider);
  }

  githubLogin() {
    const provider = new auth.GithubAuthProvider();

    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.angularFireAuth.auth.signInWithPopup(provider)
      .then((userCredential) => {
        this.log.debug('signInWithPopup: ', (userCredential !== null ? userCredential.user.uid : 'nulo') + '"');

        // this.isLoggedIn = true;

        // this.authState = userCredential.user;

        // this.updateUserData()

        // const redirectUrl = this.authService.redirectUrl; // ''; // `${monstroLogado.id}`;

        const navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        this.router.navigate([this.redirectUrl], navigationExtras);
      })
      .catch(error => console.log(error));
  }

  //// Anonymous Auth ////

  anonymousLogin() {
    return this.angularFireAuth.auth.signInAnonymously()
      .then((user) => {
        // this.authState = user;
        // this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  //// Email/Password Auth ////

  emailSignUp(email: string, password: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        // this.authState = user;
        // this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  emailLogin(email: string, password: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        // this.authState = user;
        // this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  resetPassword(email: string) {
    const authFirebase = auth();

    return authFirebase.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }

  //// Sign Out ////

  logout(): Promise<void> {
    const result = this.angularFireAuth.auth.signOut();

    result.then(() => {
      // this.isLoggedIn = false;

      this.localUser$.next(null);

      this.router.navigate(['/']);
    });

    return result;
  }
}
