import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonstroComponent } from './monstro.component';

describe('MonstroComponent', () => {
  let component: MonstroComponent;
  let fixture: ComponentFixture<MonstroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonstroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonstroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
