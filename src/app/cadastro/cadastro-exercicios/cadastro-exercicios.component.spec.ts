import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroExerciciosComponent } from './cadastro-exercicios.component';

describe('CadastroExerciciosComponent', () => {
  let component: CadastroExerciciosComponent;
  let fixture: ComponentFixture<CadastroExerciciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroExerciciosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroExerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
