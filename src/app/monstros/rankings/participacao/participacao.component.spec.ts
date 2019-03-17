import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipacaoComponent } from './participacao.component';

describe('ParticipacaoComponent', () => {
  let component: ParticipacaoComponent;
  let fixture: ComponentFixture<ParticipacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
