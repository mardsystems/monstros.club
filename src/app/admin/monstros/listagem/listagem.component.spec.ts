import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemComponent } from './listagem.component';
import { AdminComponent } from '../../admin.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { MonstrosComponent } from '../monstros.component';
import { MedidasComponent } from '../medidas/medidas.component';
import { CadastroComponent } from '../../cadastro/cadastro.component';
import { AdminMaterialModule } from '../../admin-material.module';
import { AdminRoutingModule } from '../../admin-routing.module';
import { AppCommonModule } from 'src/app/app-@common.module';
import { AngularFirestore, FirestoreSettingsToken, AngularFirestoreModule } from '@angular/fire/firestore';
import { LOCALE_ID } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

// let activatedRoute: ActivatedRouteStub;

describe('ListagemComponent', () => {
  let component: ListagemComponent;
  let fixture: ComponentFixture<ListagemComponent>;

  beforeEach(async(() => {
    const routerSpy = createRouterSpy();

    TestBed.configureTestingModule({
      imports: [
        AdminMaterialModule,
        AdminRoutingModule,
        AppCommonModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(),
        RouterModule
        // AppRoutingModule
      ],
      providers: [
        // { provide: ActivatedRoute, useValue: activatedRoute },
        // { provide: HeroService, useClass: TestHeroService },
        { provide: Router, useValue: routerSpy },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function createRouterSpy() {
  return jasmine.createSpyObj('Router', ['navigate']);
}
