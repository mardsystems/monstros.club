import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { MonstrosService } from './monstros/monstros.service';
import { Observable } from 'rxjs';
import { Monstro } from './monstros/monstros.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  monstroLogado$: Observable<Monstro>;

  constructor(
    private router: Router,
    private monstrosService: MonstrosService
  ) { }

  ngOnInit() {
    this.monstroLogado$ = this.monstrosService.monstroLogado$;

    this.monstroLogado$.subscribe((monstroLogado) => {
      if (monstroLogado != null) {
        const redirectUrl = `${monstroLogado.id}`;

        // Set our navigation extras object
        // that passes on our global query params and fragment
        const navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate([redirectUrl], navigationExtras);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

