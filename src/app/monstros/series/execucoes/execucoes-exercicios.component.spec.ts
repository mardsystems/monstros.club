import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExecucoesExerciciosComponent } from './execucoes-exercicios.component';

describe('ExecucoesExerciciosComponent', () => {
  let component: ExecucoesExerciciosComponent;
  let fixture: ComponentFixture<ExecucoesExerciciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExecucoesExerciciosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecucoesExerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
