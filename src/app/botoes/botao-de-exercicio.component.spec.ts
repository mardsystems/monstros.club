import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoDeExercicioComponent } from './botao-de-exercicio.component';

describe('BotaoDeExercicioComponent', () => {
  let component: BotaoDeExercicioComponent;
  let fixture: ComponentFixture<BotaoDeExercicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BotaoDeExercicioComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotaoDeExercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
