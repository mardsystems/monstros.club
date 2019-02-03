import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonstroPerfilComponent } from './monstro-perfil.component';

describe('MonstroPerfilComponent', () => {
  let component: MonstroPerfilComponent;
  let fixture: ComponentFixture<MonstroPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonstroPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonstroPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
