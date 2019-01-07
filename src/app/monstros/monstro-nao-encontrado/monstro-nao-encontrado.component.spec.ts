import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonstroNaoEncontradoComponent } from './monstro-nao-encontrado.component';

describe('MonstroNaoEncontradoComponent', () => {
  let component: MonstroNaoEncontradoComponent;
  let fixture: ComponentFixture<MonstroNaoEncontradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonstroNaoEncontradoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonstroNaoEncontradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
