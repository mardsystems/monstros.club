import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationExtras, Router } from '@angular/router';
import { auth, UserInfo } from 'firebase/app';
import { Observable, of, Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { LogService } from '../app-@shared.services';

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
  authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  currentUserObservable(): any {
    return this.angularFireAuth.authState;
  }

  // Returns current user UID
  currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false;
  }

  // Returns current user display name or Guest
  currentUserDisplayName(): string {
    if (!this.authState) {
      return 'Guest';
    } else if (this.currentUserAnonymous) {
      return 'Anonymous';
    } else {
      return this.authState['displayName'] || 'User without a Name';
    }
  }

  //// Custom login ////

  async login(user: string, password: string): Promise<boolean> {
    return await of(true).pipe(
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
    ).toPromise();
  }

  //// Social Auth ////

  async googleLogin(): Promise<void> {
    const provider = new auth.GoogleAuthProvider();

    await this.socialSignIn(provider);
  }

  async facebookLogin(): Promise<void> {
    const provider = new auth.FacebookAuthProvider();

    await this.socialSignIn(provider);
  }

  async twitterLogin(): Promise<void> {
    const provider = new auth.TwitterAuthProvider();

    await this.socialSignIn(provider);
  }

  async githubLogin(): Promise<void> {
    const provider = new auth.GithubAuthProvider();

    await this.socialSignIn(provider);
  }

  private async socialSignIn(provider): Promise<void> {
    try {
      const userCredential = await this.angularFireAuth.auth.signInWithPopup(provider)

      this.log.debug('signInWithPopup: ', (userCredential !== null ? userCredential.user.uid : 'nulo') + '"');

      // this.isLoggedIn = true;

      // this.authState = userCredential.user;

      // this.updateUserData()

      // const redirectUrl = this.authService.redirectUrl; // ''; // `${monstroLogado.id}`;

      const navigationExtras: NavigationExtras = {
        queryParamsHandling: 'preserve',
        preserveFragment: true
      };

      await this.router.navigate([this.redirectUrl], navigationExtras);
    } catch (e) {
      this.log.debug(e);

      throw e;
    }
  }

  //// Anonymous Auth ////

  async anonymousLogin(): Promise<void> {
    try {
      const user = await this.angularFireAuth.auth.signInAnonymously();

      // this.authState = user;

      // this.updateUserData()
    } catch (e) {
      this.log.debug(e);

      throw e;
    }
  }

  //// Email/Password Auth ////

  async emailSignUp(email: string, password: string): Promise<void> {
    try {
      const user = await this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);

      // this.authState = user;

      // this.updateUserData()
    } catch (e) {
      this.log.debug(e);

      throw e;
    }
  }

  async emailLogin(email: string, password: string): Promise<void> {
    try {
      const user = await this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);

      // this.authState = user;

      // this.updateUserData()
    } catch (e) {
      this.log.debug(e);

      throw e;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const authFirebase = auth();

      await authFirebase.sendPasswordResetEmail(email);

      this.log.debug('email sent');
    } catch (e) {
      this.log.debug(e);

      throw e;
    }
  }

  //// Sign Out ////

  async logout(): Promise<void> {
    try {
      await this.angularFireAuth.auth.signOut();

      // this.isLoggedIn = false;

      this.localUser$.next(null);

      await this.router.navigate(['/']);
    } catch (e) {
      this.log.debug(e);

      throw e;
    }
  }
}
