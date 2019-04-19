import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { AppCommonModule } from 'src/app/common/common.module';
import { environment } from 'src/environments/environment';
import { AdminMaterialModule } from '../../admin-material.module';
import { AdminRoutingModule } from '../../admin-routing.module';
import { ListagemComponent } from './listagem.component';

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
