import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesCadastroExercicioComponent } from './series-cadastro-exercicio.component';

describe('SeriesCadastroExercicioComponent', () => {
  let component: SeriesCadastroExercicioComponent;
  let fixture: ComponentFixture<SeriesCadastroExercicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesCadastroExercicioComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesCadastroExercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
