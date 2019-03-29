import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroExercicioComponent } from './cadastro-exercicio.component';

describe('CadastroComponent', () => {
  let component: CadastroExercicioComponent;
  let fixture: ComponentFixture<CadastroExercicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroExercicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroExercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
