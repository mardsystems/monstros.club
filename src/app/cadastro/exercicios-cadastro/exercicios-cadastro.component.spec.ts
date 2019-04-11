import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciciosCadastroComponent } from './exercicios-cadastro.component';

describe('ExerciciosCadastroComponent', () => {
  let component: ExerciciosCadastroComponent;
  let fixture: ComponentFixture<ExerciciosCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExerciciosCadastroComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciciosCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
